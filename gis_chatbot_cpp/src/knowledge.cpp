#include "knowledge.hpp"
#include "util.hpp"
#include <algorithm>

static ProgramKnowledge build_kb() {
    ProgramKnowledge kb;
    kb.tagline = "BMCC is the only CUNY community college with a GIS A.S. — Start Here. Go Anywhere.";

    kb.overview =
        "The BMCC Geographic Information Science (GIS) A.S. teaches how to capture, manage, analyze, and "
        "visualize spatial data, connecting maps to crucial information. Applications span public health, "
        "urban planning, conservation, transportation, business intelligence, real estate, emergency response, and more.";

    kb.sections.push_back({"Overview", kb.overview});

    kb.sections.push_back({"GIS In Action",
        "Examples: Public Health (map outbreaks and plan vaccination logistics); Rescue Operations (e.g., Haiti 2010 damage assessment and relief routing); "
        "Conservation (monitor fire risk, plan access, track wildlife corridors)."});

    kb.sections.push_back({"Careers",
        "GIS skills are in demand across health and human services, manufacturing, sustainability, transportation, government, real estate, public safety, natural resource management, business intelligence, and crime mapping."});

    kb.sections.push_back({"Transfer",
        "60-credit A.S. designed to transfer to senior colleges such as Hunter College (B.A. Geography, GIS concentration) or Lehman College."});

    kb.sections.push_back({"Internships",
        "Students have interned with EPA, NYCEDC, NYC DOT, NYC DEP, U.S. Coast Guard, National Intelligence University, Environmental Investigation Agency."});

    kb.sections.push_back({"Research",
        "Student/faculty projects include: NYC bike accident analysis; assistive tech for visually impaired mobility; water quality assessment; green infrastructure mapping for stormwater resilience."});

    kb.sections.push_back({"Resources",
        "American Geographical Society (blog); GISMO (free student membership); Geospatial Professional Network (salary survey); Open Geography Education; Society for Conservation GIS (NY/NJ chapter)."});

    kb.sections.push_back({"Events",
        "Upcoming: BMCC Annual Research Symposium (BARS) 2026 — May 20, 9:00 am–5:00 pm."});

    kb.sections.push_back({"Requirements",
        "Total: 60 credits. Common Core: 30 credits (English Comp 6; Math & Quant Reasoning 3; Life & Physical Sciences 3; Flexible Core 18 across Creative Expression 6; Individual & Society 3; Scientific World 3; U.S. Experience 3; World Cultures 3). Program Curriculum: CIS 395 Database Systems I (3); GEO 226 Environmental Conservation (3); GIS 201 Introduction to Geographic Methods (4); GIS 261 Introduction to GIS (3); GIS 361 Advanced GIS (3); MAT 209 Statistics (4); SOC 161 Health Problems in Urban Communities (3, same as AFL 161); Internship or GEO Elective (3–4); General Elective (2–3). Footnotes: take MAT 206; take GLY 210; no more than two courses in any discipline in Flexible Core; take CSC 110; choose [CED 201 and CIS 325] or GEO 241; STEM variants can satisfy general electives."});

    kb.sections.push_back({"Courses",
        "Key courses: GIS 201 (Intro to Geographic Methods), GIS 261 (Intro to GIS), GIS 361 (Advanced GIS), CIS 395 (Database Systems I), MAT 209 (Statistics), GEO 226 (Environmental Conservation), SOC 161 (Health Problems in Urban Communities)."});

    kb.contacts["Program Coordinator"] = "Professor Hao Tang — Computer Information Systems (CIS), htang@bmcc.cuny.edu";
    kb.contacts["Department"] = "Computer Information Systems Dept., Fiterman Hall F-0930, (212) 220-1476, Mon–Fri 9am–5pm";

    kb.faq.push_back({{"apply","admissions","how to apply"}, "Apply at bmcc.cuny.edu/apply and select Geographic Information Science (A.S.). For questions, contact the CIS Department at (212) 220-1476."});
    kb.faq.push_back({{"internship","intern","placement"}, "Internships include EPA, NYCEDC, NYC DOT, NYC DEP, U.S. Coast Guard, National Intelligence University, Environmental Investigation Agency."});
    kb.faq.push_back({{"transfer","hunter","lehman"}, "Designed for transfer with 60 credits to senior colleges such as Hunter (B.A. Geography, GIS concentration) or Lehman."});
    kb.faq.push_back({{"contact","coordinator","email","hao tang","htang"}, "Program Coordinator: Professor Hao Tang, htang@bmcc.cuny.edu. Dept phone: (212) 220-1476."});
    kb.faq.push_back({{"course","class","curriculum","requirements"}, "Total 60 credits: Common Core 30 + Program Curriculum 30. Core GIS sequence: GIS 201, GIS 261, GIS 361; plus CIS 395, MAT 209, GEO 226, SOC 161, internship/elective, general elective."});
    kb.faq.push_back({{"event","symposium","bars"}, "Next: BMCC Annual Research Symposium (BARS) 2026 — May 20, 9:00 am–5:00 pm."});
    kb.faq.push_back({{"why","unique","only community college"}, "BMCC is the only CUNY community college to offer a GIS degree (A.S.)."});
    kb.faq.push_back({{"career","job","path"}, "Careers span public health, urban planning, sustainability, transportation, real estate, emergency response, business intelligence, and more."});

    return kb;
}

static const ProgramKnowledge &KB() {
    static ProgramKnowledge kb = build_kb();
    return kb;
}

const ProgramKnowledge &get_program_knowledge() { return KB(); }

std::string get_section(const std::string &name) {
    auto L = to_lower(name);
    for (const auto &s : KB().sections) {
        if (to_lower(s.title) == L) return s.body;
    }
    return "Section not found.";
}

std::vector<std::string> list_sections() {
    std::vector<std::string> out; out.reserve(KB().sections.size());
    for (const auto &s : KB().sections) out.push_back(s.title);
    return out;
}

std::string answer_question(const std::string &q) {
    const auto &kb = KB();
    int best = 0; std::string best_ans;
    for (const auto &qa : kb.faq) {
        int s = keyword_score(q, qa.keywords);
        if (s > best) { best = s; best_ans = qa.answer; }
    }
    if (best > 0) return best_ans;
    if (contains_any(q, {"contact","email","phone","office"})) {
        std::string ans = "Contacts:\n";
        for (const auto &p : kb.contacts) ans += "- " + p.first + ": " + p.second + "\n";
        return ans;
    }
    if (contains_any(q, {"requirement","credit","curriculum"})) {
        return get_section("Requirements");
    }
    if (contains_any(q, {"course","class"})) {
        return get_section("Courses");
    }
    i    i    is_any(q, {"career","job"})) {
        return get_section("Careers");
    }
    if (    if (    if (    if (    i{
        return get_section("Internships");
    }
    if (contains_any(q, {"research","project"})) {
        return get_section("Research");
    }
    if (contains_any(q, {"transfer"})) {
        return get_section("Transfer");
    }
    if (contains_any(q, {"event","symposium","bars"})) {
        return get_section("Events");
    }
    return "I can answer about Overview, Requirements, Courses, Careers, Internships, Research, Transfer, Contact, Events. Try `/sections` or ask a more specific question.";
}
