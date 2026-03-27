#pragma once
#include <string>
#include <vector>
#include <unordered_map>

std::string to_lower(std::string s);
std::string trim(const std::string &s);
std::vector<std::string> split_words(const std::string &s);
bool contains_any(const std::string &hay, const std::vector<std::string> &needles);
int keyword_score(const std::string &text, const std::vector<std::string> &keywords);
std::string join(const std::vector<std::string>& parts, const std::string &sep);
