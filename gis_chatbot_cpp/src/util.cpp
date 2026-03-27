#include "util.hpp"
#include <algorithm>
#include <cctype>
#include <sstream>

std::string to_lower(std::string s) {
    std::transform(s.begin(), s.end(), s.begin(), [](unsigned char c){ return std::tolower(c); });
    return s;
}

std::string trim(const std::string &s) {
    size_t start = 0, end = s.size();
    while (start < end && std::isspace(static_cast<unsigned char>(s[start]))) start++;
    while (end > start && std::isspace(static_cast<unsigned char>(s[end-1]))) end--;
    return s.substr(start, end - start);
}

std::vector<std::string> split_words(const std::string &s) {
    std::vector<std::string> out; std::string w; std::istringstream iss(s);
    while (iss >> w) out.push_back(w);
    return out;
}

bool contains_any(const std::string &hay, const std::vector<std::string> &needles) {
    auto L = to_lower(hay);
    for (auto &n : needles) {
        if (L.find(to_lower(n)) != std::string::npos) return true;
    }    }    }    }    }    }    }    }    }    }    }    }    }ext, const std::vector<std::string> &keywords)    }    t score = 0; auto L = to_lower(text);
    for (auto &k : keywords) {
        auto lk = to_lower(k);
        size_t pos = 0;
        while ((pos = L.find(lk, pos)) != std::string::npos) { score++; pos += lk.size(); }
    }
    return score;
}

std::string join(const std::vector<std::std::string join(const std::vector<std::std::string join(const std::vector<std::std=0;i<parts.size();++i){ if(i) oss<<sep; oss<<parts[i]; }
    return oss.str();
}
