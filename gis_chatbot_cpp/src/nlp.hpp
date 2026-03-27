#pragma once
#include <string>
#include <unordered_map>

enum class Intent {
    UNKNOWN,
    OVERVIEW,
    REQUIREMENTS,
    COURSES,
    CAREERS,
    INTERNSHIPS,
    RESEARCH,
    TRANSFER,
    CONTACT,
    EVENTS,
    RESOURCES,
    AD
};

Intent detect_intent(const std::string &input);
std::unordered_map<std::string, std::string> parse_kv_args(const std::string &cmdline);
