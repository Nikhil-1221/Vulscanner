import sys
import json

def detect_attack(url):
    attack_type = "Normal"
    severity = "Low"

    url_upper = url.upper()
    url_lower = url.lower()

    if "UNION SELECT" in url_upper or "OR 1=1" in url_upper:
        attack_type = "SQL Injection"
        severity = "High"

    elif "<script>" in url_lower or "onerror=" in url_lower:
        attack_type = "XSS"
        severity = "High"

    elif "../" in url:
        attack_type = "Directory Traversal"
        severity = "Medium"

    elif ";" in url and ("ls" in url_lower or "whoami" in url_lower):
        attack_type = "Command Injection"
        severity = "High"

    elif "127.0.0.1" in url or "localhost" in url_lower:
        attack_type = "SSRF"
        severity = "High"

    return {
        "attackType": attack_type,
        "severity": severity
    }


if __name__ == "__main__":
    try:
        input_json = sys.stdin.read()
        data = json.loads(input_json)
        result = detect_attack(data["url"])
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({"error": str(e)}))