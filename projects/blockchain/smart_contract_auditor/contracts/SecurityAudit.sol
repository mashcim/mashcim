
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract SecurityAudit is Ownable, ReentrancyGuard, Pausable {
    using Counters for Counters.Counter;
    
    Counters.Counter private _auditIds;
    Counters.Counter private _vulnerabilityIds;
    
    enum VulnerabilitySeverity {
        Low,
        Medium,
        High,
        Critical
    }
    
    enum AuditStatus {
        Pending,
        InProgress,
        Completed,
        Rejected
    }
    
    struct Vulnerability {
        uint256 id;
        string title;
        string description;
        VulnerabilitySeverity severity;
        string recommendation;
        uint256 discoveredAt;
        address auditor;
    }
    
    struct Audit {
        uint256 id;
        string contractName;
        string contractAddress;
        address requester;
        address auditor;
        AuditStatus status;
        uint256 createdAt;
        uint256 completedAt;
        uint256 vulnerabilityCount;
        uint256 auditFee;
        string ipfsHash;
    }
    
    struct AuditorProfile {
        address auditorAddress;
        string name;
        uint256 completedAudits;
        uint256 reputation;
        bool isVerified;
        uint256 totalEarnings;
    }
    
    mapping(uint256 => Audit) public audits;
    mapping(uint256 => Vulnerability) public vulnerabilities;
    mapping(address => AuditorProfile) public auditorProfiles;
    mapping(address => uint256[]) public auditorAudits;
    mapping(uint256 => uint256[]) public auditVulnerabilities;
    
    uint256 public constant AUDIT_FEE = 0.1 ether;
    uint256 public constant CRITICAL_VULNERABILITY_BONUS = 0.05 ether;
    uint256 public constant MIN_REPUTATION_FOR_VERIFIED = 100;
    
    event AuditRequested(uint256 indexed auditId, address indexed requester, string contractName);
    event AuditStarted(uint256 indexed auditId, address indexed auditor);
    event AuditCompleted(uint256 indexed auditId, uint256 vulnerabilityCount);
    event VulnerabilityFound(uint256 indexed auditId, uint256 indexed vulnerabilityId, VulnerabilitySeverity severity);
    event AuditorRegistered(address indexed auditor, string name);
    event AuditorVerified(address indexed auditor);
    
    modifier onlyAuditor() {
        require(auditorProfiles[msg.sender].auditorAddress != address(0), "Not a registered auditor");
        _;
    }
    
    modifier onlyVerifiedAuditor() {
        require(auditorProfiles[msg.sender].isVerified, "Not a verified auditor");
        _;
    }
    
    modifier auditExists(uint256 auditId) {
        require(auditId > 0 && auditId <= _auditIds.current(), "Audit does not exist");
        _;
    }
    
    constructor() {

        auditorProfiles[msg.sender] = AuditorProfile({
            auditorAddress: msg.sender,
            name: "Platform Admin",
            completedAudits: 0,
            reputation: 100,
            isVerified: true,
            totalEarnings: 0
        });
    }
    
    
    function registerAuditor(string memory _name) external {
        require(auditorProfiles[msg.sender].auditorAddress == address(0), "Already registered");
        require(bytes(_name).length > 0, "Name cannot be empty");
        
        auditorProfiles[msg.sender] = AuditorProfile({
            auditorAddress: msg.sender,
            name: _name,
            completedAudits: 0,
            reputation: 50,
            isVerified: false,
            totalEarnings: 0
        });
        
        emit AuditorRegistered(msg.sender, _name);
    }
    
    
    function verifyAuditor(address _auditor) external onlyOwner {
        require(auditorProfiles[_auditor].auditorAddress != address(0), "Auditor not found");
        require(auditorProfiles[_auditor].reputation >= MIN_REPUTATION_FOR_VERIFIED, "Insufficient reputation");
        
        auditorProfiles[_auditor].isVerified = true;
        emit AuditorVerified(_auditor);
    }
    
    
    function requestAudit(
        string memory _contractName,
        string memory _contractAddress
    ) external payable nonReentrant whenNotPaused {
        require(msg.value >= AUDIT_FEE, "Insufficient audit fee");
        require(bytes(_contractName).length > 0, "Contract name required");
        
        _auditIds.increment();
        uint256 auditId = _auditIds.current();
        
        audits[auditId] = Audit({
            id: auditId,
            contractName: _contractName,
            contractAddress: _contractAddress,
            requester: msg.sender,
            auditor: address(0),
            status: AuditStatus.Pending,
            createdAt: block.timestamp,
            completedAt: 0,
            vulnerabilityCount: 0,
            auditFee: msg.value,
            ipfsHash: ""
        });
        
        emit AuditRequested(auditId, msg.sender, _contractName);
    }
    
    
    function startAudit(uint256 _auditId) external onlyAuditor auditExists(_auditId) {
        require(audits[_auditId].status == AuditStatus.Pending, "Audit not pending");
        require(audits[_auditId].auditor == address(0), "Audit already assigned");
        
        audits[_auditId].auditor = msg.sender;
        audits[_auditId].status = AuditStatus.InProgress;
        
        auditorAudits[msg.sender].push(_auditId);
        
        emit AuditStarted(_auditId, msg.sender);
    }
    
    
    function completeAudit(
        uint256 _auditId,
        string memory _ipfsHash,
        Vulnerability[] memory _vulnerabilities
    ) external onlyAuditor auditExists(_auditId) {
        require(audits[_auditId].auditor == msg.sender, "Not assigned auditor");
        require(audits[_auditId].status == AuditStatus.InProgress, "Audit not in progress");
        
        audits[_auditId].status = AuditStatus.Completed;
        audits[_auditId].completedAt = block.timestamp;
        audits[_auditId].ipfsHash = _ipfsHash;
        

        for (uint i = 0; i < _vulnerabilities.length; i++) {
            _vulnerabilityIds.increment();
            uint256 vulnerabilityId = _vulnerabilityIds.current();
            
            vulnerabilities[vulnerabilityId] = Vulnerability({
                id: vulnerabilityId,
                title: _vulnerabilities[i].title,
                description: _vulnerabilities[i].description,
                severity: _vulnerabilities[i].severity,
                recommendation: _vulnerabilities[i].recommendation,
                discoveredAt: block.timestamp,
                auditor: msg.sender
            });
            
            auditVulnerabilities[_auditId].push(vulnerabilityId);
            
            emit VulnerabilityFound(_auditId, vulnerabilityId, _vulnerabilities[i].severity);
        }
        
        audits[_auditId].vulnerabilityCount = _vulnerabilities.length;
        

        AuditorProfile storage profile = auditorProfiles[msg.sender];
        profile.completedAudits++;
        

        uint256 reputationGain = _calculateReputationGain(_vulnerabilities);
        profile.reputation += reputationGain;
        

        uint256 payment = audits[_auditId].auditFee;
        

        uint256 criticalCount = _countCriticalVulnerabilities(_vulnerabilities);
        if (criticalCount > 0) {
            payment += criticalCount * CRITICAL_VULNERABILITY_BONUS;
        }
        
        profile.totalEarnings += payment;
        

        payable(msg.sender).transfer(payment);
        
        emit AuditCompleted(_auditId, _vulnerabilities.length);
    }
    
    
    function getAudit(uint256 _auditId) external view auditExists(_auditId) returns (Audit memory) {
        return audits[_auditId];
    }
    
    
    function getAuditVulnerabilities(uint256 _auditId) external view auditExists(_auditId) returns (Vulnerability[] memory) {
        uint256[] memory vulnerabilityIds = auditVulnerabilities[_auditId];
        Vulnerability[] memory result = new Vulnerability[](vulnerabilityIds.length);
        
        for (uint i = 0; i < vulnerabilityIds.length; i++) {
            result[i] = vulnerabilities[vulnerabilityIds[i]];
        }
        
        return result;
    }
    
    
    function getAuditorAudits(address _auditor) external view returns (uint256[] memory) {
        return auditorAudits[_auditor];
    }
    
    
    function getTopAuditors(uint256 _limit) external view returns (address[] memory) {

        address[] memory result = new address[](_limit);
        uint256 count = 0;
        

        for (uint i = 1; i <= _auditIds.current() && count < _limit; i++) {
            address auditor = audits[i].auditor;
            if (auditor != address(0) && auditorProfiles[auditor].isVerified) {
                result[count] = auditor;
                count++;
            }
        }
        
        return result;
    }
    
    
    function getAuditStatistics() external view returns (
        uint256 totalAudits,
        uint256 pendingAudits,
        uint256 inProgressAudits,
        uint256 completedAudits,
        uint256 totalVulnerabilities
    ) {
        totalAudits = _auditIds.current();
        totalVulnerabilities = _vulnerabilityIds.current();
        
        for (uint i = 1; i <= totalAudits; i++) {
            if (audits[i].status == AuditStatus.Pending) {
                pendingAudits++;
            } else if (audits[i].status == AuditStatus.InProgress) {
                inProgressAudits++;
            } else if (audits[i].status == AuditStatus.Completed) {
                completedAudits++;
            }
        }
    }
    
    
    function pause() external onlyOwner {
        _pause();
    }
    
    
    function unpause() external onlyOwner {
        _unpause();
    }
    
    
    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
    
    
    function _calculateReputationGain(Vulnerability[] memory _vulnerabilities) internal pure returns (uint256) {
        uint256 gain = 10;
        
        for (uint i = 0; i < _vulnerabilities.length; i++) {
            if (_vulnerabilities[i].severity == VulnerabilitySeverity.Low) {
                gain += 2;
            } else if (_vulnerabilities[i].severity == VulnerabilitySeverity.Medium) {
                gain += 5;
            } else if (_vulnerabilities[i].severity == VulnerabilitySeverity.High) {
                gain += 10;
            } else if (_vulnerabilities[i].severity == VulnerabilitySeverity.Critical) {
                gain += 20;
            }
        }
        
        return gain;
    }
    
    
    function _countCriticalVulnerabilities(Vulnerability[] memory _vulnerabilities) internal pure returns (uint256) {
        uint256 count = 0;
        for (uint i = 0; i < _vulnerabilities.length; i++) {
            if (_vulnerabilities[i].severity == VulnerabilitySeverity.Critical) {
                count++;
            }
        }
        return count;
    }
    
    
    function getSeverityColor(VulnerabilitySeverity _severity) external pure returns (string memory) {
        if (_severity == VulnerabilitySeverity.Critical) {
            return "#ef4444";
        } else if (_severity == VulnerabilitySeverity.High) {
            return "#f97316";
        } else if (_severity == VulnerabilitySeverity.Medium) {
            return "#f59e0b";
        } else {
            return "#10b981";
        }
    }
    
    
    function getStatusColor(AuditStatus _status) external pure returns (string memory) {
        if (_status == AuditStatus.Pending) {
            return "#6b7280";
        } else if (_status == AuditStatus.InProgress) {
            return "#3b82f6";
        } else if (_status == AuditStatus.Completed) {
            return "#10b981";
        } else {
            return "#ef4444";
        }
    }
}
