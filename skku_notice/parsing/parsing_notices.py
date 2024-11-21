import os
import json
import re
from datetime import datetime
from dotenv import load_dotenv
from langchain_teddynote import logging
from langchain_openai import ChatOpenAI
from langchain_core.prompts import PromptTemplate

load_dotenv()
logging.langsmith("aid-backend") # If an error occurs, it can be removed

current_dir = os.path.dirname(os.path.abspath(__file__))
file_path = os.path.join(current_dir, "../notices.json")

def load_notices():
    with open(file_path, "r", encoding="utf-8") as file:
        data = json.load(file)
    return data

input_notice = load_notices()
# Check if input_notice is empty
if not input_notice:
    print("Input notice is empty. Exiting...")
    exit()

# Get the current date
current_date = datetime.now().date()

# Split JSON data into smaller chunks
def split_json(json_data, chunk_size):
    return [json_data[i:i + chunk_size] for i in range(0, len(json_data), chunk_size)]

# Divide input_notice into chunks
chunks = split_json(input_notice, 10)

template = """
장학금 DB를 구축해야 합니다.
모든 장학금 정보들을 아래 주의사항에 따라 주어진 형식에 맞게 반환해 주세요.
조건이 맞지 않거나 해당 정보가 없으면 null로 처리해 주세요.
content가 Content not found인 경우에만 예외적으로 scholarshipName, link, views를 제외하고 모두 null로 넣어주세요.

주의사항 및 파싱 방법:
1. `scholarshipName`: 장학금 이름입니다. Title에서 '안내', '공지', '모집', '선발', '지원'과 같은 불필요한 단어를 제거하고, 핵심 이름만 포함시켜 주세요.
    예:
    - Title: "2025-2026 중국 정부초청 장학생(CSC) 선발 안내" -> "2025-2026 중국 정부초청 장학생(CSC)"
    - Title: "2024년도 한국장학재단 국가장학금 1차 신청 안내" -> "2024년도 한국장학재단 국가장학금"
    - Title: "DB 김준기문화재단 금융수리 장학생 모집" -> "DB 김준기문화재단 금융수리 장학생"
2. `eligibleMajors`: 제출 대상이나 공지 대상을 보고 판단할 수도 있습니다. 대상 학과 목록이 없을 경우 null로 설정합니다.
    예:
    - department: 경제대학 -> ["경제대학"]
    - department: 사회과학대학 -> ["사회과학대학"]
    - department가 없거나 자생스 행정실 등 -> content 내용보고 판단
    - 이공계열 -> ["이공계열"]
3. `minimumGPARequirement`: 최소 학점이 정해져 있지 않은 경우 null로 설정합니다.
    예:
    - 백분위 90점 이상: A -> 4.0 / 백분위 80점 이상: B -> 3.0 / 백분위 70점 이상: C -> 2.0 / 백분위 60점 이상: D -> 1.0 / F -> 0.0 
4. `compTotalGPA`: 총 학점 기준이면 true, 직전 학기 기준인 경우 false로 설정합니다. (default: true)
5. `eligibleSemesters`: 장학금 신청이 가능한 학기를 숫자 배열(Array of Numbers) 형태로 반환합니다. 학년은 [1, 2, 3, 4], 학기는 [1, 2]로 구성됩니다. 예를 들어 1학년 1학기부터 3학년 2학기까지 지원 가능하면 [1, 2, 3, 4, 5, 6]로 반환합니다. 지원 가능한 학기 정보가 없거나 불명확하면 null로 설정합니다.
    예:
    - "2학년부터 3학년까지 지원 가능" -> [3, 4, 5, 6]
    - "2학년 1학기 이상" -> [3, 4, 5, 6, 7, 8]
    - "5학기 이상" -> [5, 6, 7, 8]
    - "5학기 진학 예정자" -> [4] / "다음학기 기준으로 3학기에 해당하는 재학생" -> [2]
    - "등록학기 기준 5학기~6학기" -> [5, 6]
    - "대학원생만 지원 가능" -> null
    - "지원 학기 정보 없음" -> null
6. `scholarshipType`: 성적 우수 장학금, 생활비 지원 장학금, 등록금성 장학금 유형 중 하나로 명시해 주세요.
7. `ageLimit`: 나이 제한이 없으면 null로 설정합니다.
8. `regionalRestrictions`: 특정 지역에서만 지원 가능하다면 해당 지역을 배열로 넣고, 제한이 없다면 null로 설정합니다.
9. `incomeLevelRequirement`: 소득 분위 제한이 없는 경우 null로 설정합니다.
10. `applicationPeriod`: "시작일 ~ 종료일" 형식으로 작성합니다. 시작일은 content를 참고하지 않고 반드시 start_date로 작성합니다.
11. `scholarshipAmount`: 장학금 금액이 정해져 있지 않으면 null로 설정합니다. 구체적으로 장학금 혜택이 어떻게 되는지 string 형태로 작성해주세요.
12. `numberOfRecipients`: 선발 인원이 정해져 있지 않으면 null로 설정합니다.
13. `requiredDocuments`: [붙임]이나 첨부파일에 제출서류가 있는지도 확인니다. 제출 서류가 따로 없으면 null로 설정합니다.
14. `applicationMethod`: 온라인 신청, 우편 접수 등 구체적인 방법을 기재합니다. 이메일 제출인 경우 있으면 이메일 주소도 함께 기재합니다.
    예.
    - 이메일 제출 (example@example.com)
15. `significant`: 행사 참석 필수, 탈북민 대상자 등 특이사항이 없으면 null로 설정합니다.
16. `link`: link 그대로 입력
17. `views`: 0으로 넣습니다. (초기화)
18. `foundation`: 재단 이름. department를 그대로 따라가지 않을 수도 있습니다. content를 참고하세요.
    예.
    - 단순한 교내 장학금 -> 학과 이름
    - 정용지 창의장학생 -> "(주) 케어젠" ((주) 케어젠의 대표가 정용지라는 내용이 있을 것임.)
19. `uploadedDate`: current_date 그대로 입력

정보:
{input_notice}

현재 날짜:
{current_date}

FORMAT:
{{
    "scholarshipName": "string",                      // 장학금 이름
    "eligibleMajors": "array or null",                // 지원 대상 학과 배열, 정보가 없으면 null
    "minimumGPARequirement": "number or null",        // 최소 학점 기준, 정보가 없으면 null
    "compTotalGPA": "boolean"                         // 총 학점 기준 여부
    "eligibleSemesters": "array (number)",            // 지원 대상 학기 및 학년 정보
    "scholarshipType": "string",                      // 장학금 유형
    "ageLimit": "number or null",                     // 나이 제한, 정보가 없으면 null
    "regionalRestrictions": "array or null",          // 지역 제한, 정보가 없으면 null
    "incomeLevelRequirement": "number or null",       // 소득분위 기준, 정보가 없으면 null
    "applicationPeriod": "string",                    // 신청 기간 (예: "2024-01-01 ~ 2024-12-31") - 앞에는 반드시 start_date로 작성
    "scholarshipAmount": "string or null",            // 장학금 금액, 정보가 없으면 null
    "numberOfRecipients": "integer",                  // 선발 인원, 정보가 없으면 null
    "requiredDocuments": "array or null",             // 제출 서류 배열, 정보가 없으면 null
    "applicationMethod": "string or null",            // 신청 방법
    "significant": "string or null",                  // 특이사항, 정보가 없으면 null
    "link": "string",                                 // 장학금 안내 링크
    "views": "integer",                               // 조회수 (0으로 입력)
    "foundation": "string"                            // 재단 이름
    "uploadedDate": "string"                          // current_date
}}
"""

prompt_template = PromptTemplate(input_variables=["input_notice", "current_date"], template=template)

model = ChatOpenAI(
    temperature=0.1,
    model_name="gpt-4o",
)

# Process each chunk
responses = []
for chunk in chunks:
    formatted_prompt = prompt_template.format(
        input_notice=json.dumps(chunk, ensure_ascii=False),
        current_date=current_date
    )
    response = model.invoke(formatted_prompt)
    responses.append(response.content)
    
regions_mapping = {
    '서울': [
      '강남구', '강동구', '강북구', '강서구', '관악구', '광진구', '구로구',
      '금천구', '노원구', '도봉구', '동대문구', '동작구', '마포구', '서대문구',
      '서초구', '성동구', '성북구', '송파구', '양천구', '영등포구', '용산구',
      '은평구', '종로구', '중구', '중랑구'
    ],
    '경기': [
      '가평군', '고양시', '과천시', '광명시', '광주시', '구리시', '군포시',
      '김포시', '남양주시', '동두천시', '부천시', '성남시', '수원시', '시흥시',
      '안산시', '안성시', '안양시', '양주시', '양평군', '여주군', '연천군', '오산시',
      '용인시', '의왕시', '의정부시', '이천시'
    ],
    '충청': [
      '천안시', '청주시', '공주시', '보령시', '아산시', '서산시', '논산시', '계룡시',
      '당진시', '금산군', '연기군', '부여군', '서천군', '청양군', '홍성군', '예산군',
      '태안군'
    ],
    '전라': [
      '전주시', '군산시', '익산시', '정읍시', '남원시', '김제시', '완주군', '진안군',
      '무주군', '장수군', '임실군', '순창군', '고창군', '부안군'
    ],
    '경상': [
      '포항시', '경주시', '김천시', '안동시', '구미시', '영주시', '영천시', '상주시',
      '문경시', '경산시', '군위군', '의성군', '청송군', '영양군', '영덕군', '청도군',
      '고령군', '성주군', '칠곡군', '예천군', '봉화군', '울진군', '울릉군', '통영시'
    ],
    '강원': [
      '강릉시', '동해시', '속초시', '원주시', '춘천시', '태백시', '삼척시', '홍천군',
      '횡성군', '영월군', '평창군', '정선군', '철원군', '화천군', '양구군', '인제군',
      '고성군', '양양군'
    ],
}

majors_mapping = {
    '소프트웨어융합대학': [
        '소프트웨어학과', '지능형소프트웨어학과','글로벌바이오메디컬공학과', '응용AI융합학부'
    ],
    '글로벌융합학부': [
        '데이터사이언스융합전공', '인공지능융합전공', '컬처앤테크놀로지융합전공'
    ],
    '유학대학': ['유학동양학과'],
    '인문과학대학': [
        '국어국문학과', '영어영문학과', '프랑스어문학과', '러시아어문학과',
        '중어중문학과', '독어독문학과', '한문학과', '사학과', '철학과', '문헌정보학과'
    ],
    '사회과학대학': [
        '행정학과', '정치외교학과', '미디어커뮤니케이션학과', '사회학과',
        '사회복지학과', '심리학과', '소비자학과', '아동청소년학과', '글로벌리더학부'
    ],
    '경제대학': ['경제학과', '통계학과', '글로벌경제학과'],
    '경영대학': ['경영학과', '글로벌경영학과'],
    '자연과학대학': ['생명과학과', '수학과', '물리학과', '화학과'],
    '생명공학대학': ['식품생명공학과', '바이오메카트로닉스학과', '융합생명공학과'],
    '정보통신대학': ['전자전기공학부', '반도체시스템공학과', '반도체융합공학과', '소재부품융합공학과'],
    '공과대학': [
        '화학공학/고분자시스템공학부', '신소재공학부', '기계공학부',
        '건설환경공학부', '시스템경영공학과', '나노공학과', '건축학과'
    ],
    '사범대학': ['교육학과', '한문교육과', '수학교육과', '컴퓨터교육과'],
    '예술대학': ['미술학과', '디자인학과', '무용학과', '영상학과', '연기예술학과', '의상학과'],
    '약학대학': ['약학과'],
    '스포츠과학대학': ['스포츠과학과'],
    '의과대학': ['의예과', '의학과'],
}

second_prompt_template = """
아래는 장학금 데이터입니다:

{scholarship_data}

지역 및 학과 정보를 아래 매핑에 따라 업데이트해야 합니다.

지역 매핑:
{regions_mapping}

학과 매핑:
{majors_mapping}

업데이트 방법:
1. 'regionalRestrictions' 필드에 있는 지역명을 매핑하여 해당 지역의 시/군 목록으로 대체합니다. 
    예를 들어 '경기도'는 '경기'에 해당하는 모든 시/군으로 대체합니다.
    반드시 value에 있는 것들만 포함을 해야 합니다. 만약 아닌 경우 맞는 것으로 대체하거나 null로 처리합니다.
2. 'eligibleMajors' 필드에 있는 학과명을 매핑하여 해당하는 세부 학과 목록으로 대체합니다. 
    예를 들어 '공학계열'은 '공과대학' 아래의 모든 학과로 대체합니다.
    반드시 vaule에 있는 학과 이름으로 array에 추가해야 합니다. 
        - 예를 들어 '생명과학계열'인 경우 '생명과학과'와 생명공학대학에 해당하는 학과로 대체합니다.   
        - '경제', '경영'이 아닌 '경제학과', '경영학과'와 같은 value에 있는 정확한 학과 명칭을 작성합니다.
        - '반도체'와 같은 경우 '정보통신대학'에 해당하는 학과들로 대체합니다.
        - '이공계열'은 이공계열 대학에 해당하는 학과들로 대체합니다.
    만약 없는 경우, 예를 들어 '보험계리학'과 같은 경우 null이나 없애는 것으로 대체합니다.

위 지침에 따라 데이터를 업데이트하고, 동일한 형식으로 반환해 주세요.
"""

second_model = ChatOpenAI(
    temperature=0.3,
    model_name="gpt-4o-mini",
)

# Process each chunk for the second step
final_processed_responses = []
for chunk in responses:
    formatted_second_prompt = second_prompt_template.format(
        scholarship_data=json.dumps(chunk, ensure_ascii=False),
        regions_mapping=json.dumps(regions_mapping, ensure_ascii=False, indent=4),
        majors_mapping=json.dumps(majors_mapping, ensure_ascii=False, indent=4)
    ) 

    second_response = second_model.invoke(formatted_second_prompt)
    final_processed_responses.append(second_response.content)
    
answer_json = []
for response in final_processed_responses:
    response_text = response.strip()
    if "```json" in response_text:
        response_text = response_text.split("```json", 1)[1]
    if "```" in response_text:
        response_text = response_text.split("```", 1)[0]

    try:
        data = json.loads(response_text)
        if isinstance(data, list):
            answer_json.extend(data)
        elif isinstance(data, dict):
            answer_json.append(data)
        else:
            print("Unexpected data format:", data)
    except json.JSONDecodeError as e:
        print("JSONDecodeError 발생:", e)

answer_file_path = os.path.join(current_dir, "response.json")
with open(answer_file_path, "w", encoding="utf-8") as file:
    json.dump(answer_json, file, ensure_ascii=False, indent=4)
print("JSON 파일로 저장되었습니다.")