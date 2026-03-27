#include <iostream>
#include <string>
#include <vector>
#include "nlp.hpp"
#include "knowledge.hpp"
#include "ad_generator.hpp"
#include "util.hpp"

static void print_help() {
    std::cout << "Commands:\n";
    std::cout << "  Type a question (e.g., What internships are available?).\n";
    std::cout << "  /ad platform=<twitter|instagram|linkedin|facebook|print> style=<energetic|professional|inspiring|concise> length=<short|medium|long> focus=<overview|careers|internships|transfer|requirements> cta=\"Apply Now\" geo=NYC\n";
    std::cout << "  /sections    # list knowledge sections\n";
    std::cout << "  /section=<Name>   # print a section by name (e.g., /section=Requirements)\n";
    std::cout << "  /help, /quit\n";
}

int main() {
    std::cout << "BMCC GIS Chatbot (C++) — Offline Q&A + Ad Generator\n";
    std::cout << "Knowledge date: 2026-03-12\n";
    print_help();

    std::string line;
    while (true) {
        std::cout << "\n> ";
        if (!std::getline(std::cin, line)) break;
        line = trim(line);
        if (line.empty()) continue;
        if (line == "/quit" || line == "/exit") break;
        if (line == "/help") { print_help(); continue; }
        if (line == "/sections") {
            auto secs = list_sections();
            std::cout << "Sections:\n";
            for (auto &s : secs) std::cout << "- " << s << "\n";
            continue;
        }
        if (line.rfind("/section=", 0) == 0) {
            std::string name = line.substr(std::string("/section=").size());
            std::cout << get_section(name) << "\n";
            continue;
        }
        if (line.rfind("/ad", 0) == 0) {
            auto kv = parse_kv_args(line);
            auto spec = ad_spec_from_args(kv);
            std::cout << generate_ad(spec) << "\n";
            continue;
        }

        Intent intent = detect_intent(line);
        switch (intent) {
            case Intent::OVERVIEW:
                std::cout << get_program_knowledge().overview << "\n"; break;
            case Intent::REQUIREMENTS:
                std::cout << get_section("Requirements") << "\n"; break;
            case Intent::COURSES:
                std::cout << get_section("Courses") << "\n"; break;
            case Intent::CAREERS:
                std::cout << get_section("Careers") << "\n"; break;
                                                                 < get_section("Internships") << "\n"; break;
            case Intent::RESEARCH:
                std::cout << get_section("Research") << "\n"; break;
            case Intent::TRANSFER:
                std::cout << get_section("Transfer") << "\n"; break;
            case Intent::CONTACT: {
                const auto &kb = get_program_knowledge();
                for (const auto &p : kb.contacts) std::cout << p.first << ": " << p.second << "\n";
                break; }
            case Intent::EVENTS:
                std::cout << get_section("Events") << "\n"; break;
            case Intent::RESOURCES:
                std::cout << get_section("Resources") << "\n"; break;
            case Intent::AD: {
                auto spec = AdSpec{"twitter","energetic","short","overview","Apply Now","NYC"};
                std::cout << generate_ad(spec) << "\n"; break; }
            default:
                std::cout << answer_question(line) << "\n"; break;
        }
    }
    std::cout << "Goodbye.\n";
    return 0;
}
