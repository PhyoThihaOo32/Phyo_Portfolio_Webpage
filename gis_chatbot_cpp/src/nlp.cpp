#include "nlp.hpp"
#include "util.hpp"
#include <algorithm>
#include <regex>

Intent detect_intent(const std::string &input) {
    auto L = to_lower(input);
    if (contains_any(L, {"overview","what is gis","about gis","about the program"})) return Intent::OVERVIEW;
    if (contains_any(L, {"requirement","curriculum","credits","common core","program curriculum","courses required"})) return Intent::REQUIREMENTS;
    if (contains_any(L, {"course","listing","classes"})) return Intent::COURSES;
    if (contains_any(L, {"career","job","salary","path"})) return Intent::CAREERS;
    if (contains_any(L, {"internship","intern","placement"})) return Intent::INTERNSHIPS;
    if (contains_any(L, {"research","project"})) return Intent::RESEARCH;
    if (contains_any(L, {"transfer","hunter","lehman"})) return Intent::TRANSFER;
    if (contains_any(L, {"contact","email","phone","office"})) return Intent::CONTACT;
    if (contains_any(L, {"e    if (contains_any(L, {"e    if (contains_any(L, {"e    if (containny(L, {"resource    if (conta","society"})) return Intent::RESOURCES;
    if (L.rfind("/ad", 0) == 0 || contains_any(L, {"advertise","ad copy","promote"})) return Intent::AD;
    return Intent::UNKNOWN;
}

std::unordered_map<std::string, std::string> parse_kv_args(const std::string &cmdline) {
    // Parses key=value pairs, supports quoted values.
    std::unordered_map<std::string, std::string> kv;
    std::regex re(R"((\w+)=((?:\"[^\"]*\")|(?:'[^']*')|[^\s]+))");
    auto begin = std::sregex_iterator(cmdline.begin(), cmdline.end(), re);
    auto end = std::sregex_iterator();
    for (auto it = begin; it != end; ++it) {
        std::string k = (*it)[1];
        std::string v = (*it)[2];
        if (!v.empty() && (v.front()=='"' || v.front()=='\'')) v = v.substr(1, v.size()-2);
        kv[to_lower(k)] = v;
    }
    return kv;
}
