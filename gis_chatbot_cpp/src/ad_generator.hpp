#pragma once
#include <string>
#include <vector>
#include <unordered_map>

struct AdSpec {
    std::string platform;   // twitter, instagram, linkedin, facebook, print
    std::string style;      // energetic, professional, inspiring, concise
    std::string length;     // short, medium, long
    std::string focus;      // careers, internships, transfer, requirements, overview
    std::string cta;        // call-to-action
    std::string geo;        // geographic emphasis, e.g., NYC
};

std::string generate_ad(const AdSpec &spec);
AdSpec ad_spec_from_args(const std::unordered_map<std::string, std::string> &args);
