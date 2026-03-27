#pragma once
#include <string>
#include <vector>
#include <unordered_map>

struct QAItem {
    std::vector<std::string> keywords; // simple matcher
    std::string answer;
};

struct ProgramSection {
    std::string title;
    std::string body;
};

struct ProgramKnowledge {
    std::string tagline;
    std::string overview;
    std::vector<ProgramSection> sections; // sections for listing
    std::vector<QAItem> faq; // for retrieval
    std::unordered_map<std::string, std::string> contacts; // label -> details
};

const ProgramKnowledge &get_program_knowledge();
std::string answer_question(const std::string &q);
std::string get_section(const std::string &name);
std::vector<std::string> list_sections();
