#ifndef CAREER_H
#define CAREER_H

#include <vector>
#include <string>

using namespace std;

class Career
{
private:
    vector<string> career;

public:
    void setCareer(vector<string>);
    vector<string> getCareer()const;
};

#endif // CAREER_H
EOF

cat > /Users/phyothihaoo/Documents/Playground/Career.cpp <<\"EOF\"
#include \"Career.h\"

void Career::setCareer(vector<string> careers)
{
    career = careers;
}

vector<string> Career::getCareer() const
{
    return career;
}
EOF

echo "Created files:" && ls -la /Users/phyothihaoo/Documents/Playground/Career.*
