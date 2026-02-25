import sys
import json

def detect_attack(url):
    attack_type = "Normal"
    severity = "Low"

    # SQL Injection
    if "UNION SELECT" in url.upper() or "OR 1=1" in url.upper():
        attack_type = "SQL Injection"
        severity = "High"

    # XSS
    elif "<script>" in url.lower() or "onerror=" in url.lower():
        attack_type = "XSS"
        severity = "High"

    # Directory Traversal
    elif "../" in url:
        attack_type = "Directory Traversal"
        severity = "Medium"

    # Command Injection
    elif ";" in url and ("ls" in url or "whoami" in url):
        attack_type = "Command Injection"
        severity = "High"

    # SSRF
    elif "127.0.0.1" in url or "localhost" in url:
        attack_type = "SSRF"
        severity = "High"

    return {
        "attackType": attack_type,
        "severity": severity
    }


if __name__ == "__main__":
    input_data = json.loads(sys.argv[1])
    result = detect_attack(input_data["url"])
    print(json.dumps(result))