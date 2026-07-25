# Security Validation Report

**Generated:** 2026-07-25T16:49:53.975Z  
**Score:** 94/100

## Attack Simulations

| Test | Attack | Expected | Result |
|------|--------|----------|--------|
| permission_escalation | Query memory records from another company | Zero rows returned or access denied | ✅ BLOCKED |
| sandbox_escape | Access sandbox API for uninstalled plugin | Denied | ✅ BLOCKED |
| replay_attack | Insert duplicate domain event ID | Unique constraint violation | ✅ BLOCKED |
| token_abuse | Detect plaintext integration tokens | Security observatory detects plaintext | ✅ BLOCKED |
| event_injection | Inject event with unknown type | Stored but isolated from catalog processing | ⚠️ DETECTED |
| credential_misuse | Detect expired integration credentials | Findings recorded | ⚠️ DETECTED |
| plugin_isolation_bypass | Plugin with empty allowedApis cannot access memory.write | Denied at policy level | ✅ BLOCKED |

## Security Observatory Integration

Security Health remains independent from Platform Health (AIP-40).

All attack simulations mitigated or detected.
