#include "ad_generator.hpp"
#include "knowledge.hpp"
#include "util.hpp"
#include <sstream>

static std::string cap(const std::string &s) {
    if (s.empty()) return s; std::string t = s; t[0] = std::toupper(t[0]); return t;
}

AdSpec ad_spec_from_args(const std::unordered_map<std::string, std::string> &args) {
    AdSpec s{};
    auto get = [&](const std::string& k, const std::string &def)->std::string{
        auto it = args.find(k); return it==args.end()?def:it->second;
    };
    s.platform = to_lower(get("platform","twitter"));
    s.style = to_lower(get("style","energetic"));
    s.length = to_lower(get("length","short"));
    s.focus = to_lower(get("focus","overview"));
    s.cta = get("cta","Apply Now");
    s.geo = get("geo","NYC");
    return s;
}

std::string generate_ad(const AdSpec &spec) {
    const auto &kb = get_program_knowledge();
    std::ostringstream out;
    std::string hash = (spec.platform == "twitter" || spec.platform == "instagram") ? " #GIS #BMCC" : "";

    std::string hook;
    if (spec.style == "energetic") hook = "Start Here. Go Anywhere.";
    else if (spec.style == "professional") hook = "Build in-demand GIS skills at BMCC";
    else if (spec.style == "inspiring") hook = "Map a better future";
    else hook = "BMCC GIS (A.S.)";

    std::string focus;
    if (spec.focus == "careers") {
        focus = "GIS powers public health, urban planning, sustainability, transportation, real estate, emergency response, and more.";
    } else if (spec.focus == "internships") {
        focus = "Intern with NYC agencies        focus = "Intern with NYC agencies       U.S. Coast Guard).";
    } else if (spec.focus == "transfer") {
        focus = "Seamless transfer to senior colleges like Hunter (B.A. Geography, GIS concentration) or Lehman.";
                                 uirements") {
                                            n la                        GIS 361 plus Database Systems and Statistics.";
    } else {
        focus = "BMCC is CUNY's only community col      ffering a GIS A.S., learning to capture, analyze, and map spatial data.";
    }

    std::string body;
    if (spec.length == "short") {
        body = hook + " Learn GIS in " + spec.geo + ". " + focus + " " + spec.cta + "." + hash;
    } else if (spec.length == "medium") {
                         n the heart of " + spec.geo + ", master mapping, spatial analysis, and visualization. " + focus + " " + spec.cta + "." + hash;
    } else {
        body = hook + "\n";
        body += "At BMCC (CUNY), earn a 60-credit A.S. in Geographic Information Science. Hands-on labs, real NYC projects, and internships with city/federal partners. " + focus + "\n";
        body += "Get advising, career coaching, and research opportunities. " + spec.cta + "." + hash;
    }

    if (spec.platform == "linkedin") {
        body += "\nLearn more: bmcc.cuny.edu/cis/gis";
    } else if (spec.platform == "print") {
        body = "BMCC GIS (A.S.) — " + hook + "\n" +         "\nApply: bmcc.cuny.edu/apply  •  Contact: htang@bmcc.cuny.edu  •  (212) 220-1476";
    }

    return body;
}
