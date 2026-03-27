cmake_minimum_required(VERSION 3.12)
project(gis_chatbot_cpp LANGUAGES CXX)
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
add_executable(gis_chatbot
  src/main.cpp
  src/knowledge.cpp
  src/nlp.cpp
  src/ad_generator.cpp
  src/util.cpp
)
target_include_directories(gis_chatbot PRIVATE src)
