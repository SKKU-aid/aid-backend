db = db.getSiblingDB('auth');

const usersData = [
    {
        "_id": "example@skku.edu",
        "userPassword": "1398",
        "sex": true,
        "birthday": "2000-01-01T00: 00: 00.000+00: 00",
        "currentSemester": 6,
        "currentStatus": 1,
        "incomeLevel": 1,
        "lastGPA": 4.5,
        "major": "경영",
        "region": "수원시",
        "totalGPA": 4.5,
        "savedScholarship": [
            1,
            2,
            3,
            4,
            5
        ]
    }
]

const scholarshipsData = [
    {
    "_id": 1,
    "scholarshipName": "DB드림서포트장학금",
    "eligibleMajors": [
      "경영",
      "경제",
      "공학"
    ],
    "minimumGPARequirement": 3,
    "eligibleSemesters": [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8
    ],
    "scholarshipType": "생활비 지원 장학금",
    "ageLimit": null,
    "regionalRestrictions": null,
    "incomeLevelRequirement": 2,
    "applicationPeriod": "2024-11-01 ~ 2024-11-13",
    "scholarshipAmount": "2500000원",
    "numberOfRecipients": 7,
    "requiredDocuments": [
      "장학신청서",
      "추천서",
      "성적증명서",
      "학자금 지원구간 통지서"
    ],
    "applicationMethod": "이메일 접수",
    "significant": null,
    "link": "https://www.skku.edu/skku/campus/skk_comm/notice06.do?mode=view&articleNo=121493&article.offset=0&articleLimit=10",
    "views": 7301,
    "foundation": "DB김준기 문화재단"
  },
  {
    "_id": 2,
    "scholarshipName": "유일한장학생(대학원)",
    "eligibleMajors": null,
    "minimumGPARequirement": null,
    "eligibleSemesters": [
      -1
    ],
    "scholarshipType": "생활비 지원 장학금",
    "ageLimit": null,
    "regionalRestrictions": null,
    "incomeLevelRequirement": null,
    "applicationPeriod": "2024-11-01 ~ 2024-11-08",
    "scholarshipAmount": null,
    "numberOfRecipients": 1,
    "requiredDocuments": [
      "장학생 추천서",
      "학업계획서",
      "개인정보 동의서"
    ],
    "applicationMethod": "이메일 접수",
    "significant": null,
    "link": "https://www.skku.edu/skku/campus/skk_comm/notice06.do?mode=view&articleNo=121822&article.offset=0&articleLimit=10",
    "views": 732,
    "foundation": "유한재단"
  },
  {
    "_id": 3,
    "scholarshipName": "유일한장학생(대학원)",
    "eligibleMajors": null,
    "minimumGPARequirement": null,
    "eligibleSemesters": [
      -1
    ],
    "scholarshipType": "생활비 지원 장학금",
    "ageLimit": null,
    "regionalRestrictions": null,
    "incomeLevelRequirement": null,
    "applicationPeriod": "2024-10-25 ~ 2024-10-28",
    "scholarshipAmount": null,
    "numberOfRecipients": 2,
    "requiredDocuments": [
      "장학생 추천서",
      "학업계획서",
      "개인정보 동의서"
    ],
    "applicationMethod": "이메일 접수",
    "significant": null,
    "link": "https://www.skku.edu/skku/campus/skk_comm/notice06.do?mode=view&articleNo=121302&article.offset=0&articleLimit=10",
    "views": 4566,
    "foundation": "유한재단"
  },
  {
    "_id": 4,
    "scholarshipName": "유하푸른재단 장학생",
    "eligibleMajors": [
      "이공계열"
    ],
    "minimumGPARequirement": 3.5,
    "eligibleSemesters": [
      3
    ],
    "scholarshipType": "등록금성 장학금",
    "ageLimit": 29,
    "regionalRestrictions": null,
    "incomeLevelRequirement": null,
    "applicationPeriod": "2024-10-28 ~ 2024-11-04",
    "scholarshipAmount": "2000000원",
    "numberOfRecipients": 1,
    "requiredDocuments": [
      "지도교수 추천서",
      "지원서",
      "가족관계증명서",
      "성적증명서"
    ],
    "applicationMethod": "이메일 접수",
    "significant": null,
    "link": "https://www.skku.edu/skku/campus/skk_comm/notice06.do?mode=view&articleNo=121620&article.offset=0&articleLimit=10",
    "views": 3722,
    "foundation": "유하푸른재단"
  },
  {
    "_id": 5,
    "scholarshipName": "소청장학재단 장학생",
    "eligibleMajors": [
      "생명과학계열"
    ],
    "minimumGPARequirement": 4,
    "eligibleSemesters": [
      1,
      2
    ],
    "scholarshipType": "등록금성 장학금",
    "ageLimit": null,
    "regionalRestrictions": null,
    "incomeLevelRequirement": 3,
    "applicationPeriod": "2024-10-28 ~ 2024-11-05",
    "scholarshipAmount": "1000000원",
    "numberOfRecipients": 1,
    "requiredDocuments": [
      "추천서",
      "재학증명서",
      "성적증명서",
      "학자금 지원구간 통지서",
      "교육비납입증명서",
      "통장 사본"
    ],
    "applicationMethod": "이메일 접수",
    "significant": null,
    "link": "https://www.skku.edu/skku/campus/skk_comm/notice06.do?mode=view&articleNo=121571&article.offset=0&articleLimit=10",
    "views": 4623,
    "foundation": "소청장학재단"
  },
  {
    "_id": 6,
    "scholarshipName": "수원지역동문회 장학생",
    "eligibleMajors": null,
    "minimumGPARequirement": null,
    "eligibleSemesters": [
      2,
      3,
      4
    ],
    "scholarshipType": "등록금성 장학금",
    "ageLimit": null,
    "regionalRestrictions": [
      "경기도 수원시",
      "오산시",
      "화성시",
      "의왕시",
      "군포시"
    ],
    "incomeLevelRequirement": null,
    "applicationPeriod": "2024-10-30 ~ 2024-11-20",
    "scholarshipAmount": "1500000원",
    "numberOfRecipients": 3,
    "requiredDocuments": [
      "장학금 신청서",
      "자기소개서",
      "성적표",
      "주민등록등본",
      "가족관계증명서",
      "건강보험료납입증명서"
    ],
    "applicationMethod": "이메일 접수",
    "significant": "송년의밤 행사 참석 필수",
    "link": "https://www.skku.edu/skku/campus/skk_comm/notice06.do?mode=view&articleNo=121750&article.offset=0&articleLimit=10",
    "views": 1023,
    "foundation": "성균관대학교 수원동문회"
  },
  {
    "_id": 7,
    "scholarshipName": "비교과 챌린지 장학금",
    "eligibleMajors": null,
    "minimumGPARequirement": 2,
    "eligibleSemesters": [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8
    ],
    "scholarshipType": "생활비 지원 장학금",
    "ageLimit": null,
    "regionalRestrictions": null,
    "incomeLevelRequirement": null,
    "applicationPeriod": "2024-10-30 ~ 2024-12-20",
    "scholarshipAmount": "30~100만원",
    "numberOfRecipients": 160,
    "requiredDocuments": null,
    "applicationMethod": "온라인 신청",
    "significant": null,
    "link": "https://www.skku.edu/skku/campus/skk_comm/notice06.do?mode=view&articleNo=121768&article.offset=0&articleLimit=10",
    "views": 2793,
    "foundation": null
  },
  {
    "_id": 8,
    "scholarshipName": "통영시 저소득 대학생 장학금",
    "eligibleMajors": null,
    "minimumGPARequirement": "C학점 이상",
    "eligibleSemesters": [
      1,
      2,
      3,
      4
    ],
    "scholarshipType": "생활비 지원 장학금",
    "ageLimit": null,
    "regionalRestrictions": [
      "통영시"
    ],
    "incomeLevelRequirement": 0,
    "applicationPeriod": "2024-11-01 ~ 2024-11-20",
    "scholarshipAmount": "1000000원",
    "numberOfRecipients": null,
    "requiredDocuments": [
      "장학금 지급신청서",
      "기초생활수급자 증명서",
      "재학증명서",
      "성적증명서",
      "생활기록부",
      "주민등록초본",
      "통장사본"
    ],
    "applicationMethod": "방문 또는 우편 신청",
    "significant": null,
    "link": "https://www.skku.edu/skku/campus/skk_comm/notice06.do?mode=view&articleNo=121786&article.offset=0&articleLimit=10",
    "views": 435,
    "foundation": "통영시"
  },
  {
    "_id": 9,
    "scholarshipName": "디딤돌장학금",
    "eligibleMajors": null,
    "minimumGPARequirement": null,
    "eligibleSemesters": [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8
    ],
    "scholarshipType": "생활비 지원 장학금",
    "ageLimit": null,
    "regionalRestrictions": null,
    "incomeLevelRequirement": null,
    "applicationPeriod": "2024-10-31 ~ 2024-11-18",
    "scholarshipAmount": "200만원 / 100만원",
    "numberOfRecipients": null,
    "requiredDocuments": null,
    "applicationMethod": "이메일 접수",
    "significant": null,
    "link": "https://www.skku.edu/skku/campus/skk_comm/notice06.do?mode=view&articleNo=121788&article.offset=0&articleLimit=10",
    "views": 2055,
    "foundation": null
  },
  {
    "_id": 10,
    "scholarshipName": "KC 미래장학금",
    "eligibleMajors": [
      "반도체",
      "첨단소재"
    ],
    "minimumGPARequirement": 3,
    "eligibleSemesters": [
      5,
      6
    ],
    "scholarshipType": "등록금성 장학금",
    "ageLimit": null,
    "regionalRestrictions": null,
    "incomeLevelRequirement": null,
    "applicationPeriod": "2024-11-01 ~ 2025-01-10",
    "scholarshipAmount": "전액 지원",
    "numberOfRecipients": 10,
    "requiredDocuments": [
      "장학생 지원서",
      "자기소개서",
      "장학금 수혜 확인서",
      "학자금 지원구간 통지서",
      "재학증명서",
      "성적증명서",
      "지도교수 추천서"
    ],
    "applicationMethod": "이메일 접수",
    "significant": null,
    "link": "https://www.skku.edu/skku/campus/skk_comm/notice06.do?mode=view&articleNo=121815&article.offset=0&articleLimit=10",
    "views": 1272,
    "foundation": "KC미래장학재단"
  },
  {
    "_id": 11,
    "scholarshipName": "대산장학생",
    "eligibleMajors": [
      "농업계열"
    ],
    "minimumGPARequirement": 3.5,
    "eligibleSemesters": [
      4
    ],
    "scholarshipType": "등록금성 장학금",
    "ageLimit": null,
    "regionalRestrictions": null,
    "incomeLevelRequirement": null,
    "applicationPeriod": "2024-10-08 ~ 2024-11-06",
    "scholarshipAmount": "전액 지원",
    "numberOfRecipients": 5,
    "requiredDocuments": [
      "지원서",
      "재학증명서",
      "성적증명서",
      "가족관계증명서"
    ],
    "applicationMethod": "이메일 접수",
    "significant": null,
    "link": "https://www.skku.edu/skku/campus/skk_comm/notice06.do?mode=view&articleNo=121283&article.offset=10&articleLimit=10",
    "views": 1789,
    "foundation": "대산농촌재단"
  },
  {
    "_id": 12,
    "scholarshipName": "신대학원우수장학금",
    "eligibleMajors": null,
    "minimumGPARequirement": 3.5,
    "eligibleSemesters": [
      -1
    ],
    "scholarshipType": "등록금성 장학금",
    "ageLimit": null,
    "regionalRestrictions": null,
    "incomeLevelRequirement": null,
    "applicationPeriod": "2024-10-08 ~ 2024-10-10",
    "scholarshipAmount": null,
    "numberOfRecipients": null,
    "requiredDocuments": [
      "추천서",
      "성적증명서"
    ],
    "applicationMethod": "학과 사무실 제출",
    "significant": null,
    "link": "https://www.skku.edu/skku/campus/skk_comm/notice06.do?mode=view&articleNo=120988&article.offset=10&articleLimit=10",
    "views": 8987,
    "foundation": null
  },
  {
    "_id": 13,
    "scholarshipName": "국가근로장학금",
    "eligibleMajors": null,
    "minimumGPARequirement": null,
    "eligibleSemesters": null,
    "scholarshipType": "근로장학금",
    "ageLimit": null,
    "regionalRestrictions": null,
    "incomeLevelRequirement": null,
    "applicationPeriod": "2024-10-11 ~ 2024-12-19",
    "scholarshipAmount": "12220원/시간",
    "numberOfRecipients": 255,
    "requiredDocuments": null,
    "applicationMethod": "한국장학재단 홈페이지",
    "significant": null,
    "link": "https://www.skku.edu/skku/campus/skk_comm/notice06.do?mode=view&articleNo=121338&article.offset=10&articleLimit=10",
    "views": 3334,
    "foundation": "한국장학재단"
  },
  {
    "_id": 14,
    "scholarshipName": "안산시 대학생 본인부담 등록금 반값지원",
    "eligibleMajors": null,
    "minimumGPARequirement": null,
    "eligibleSemesters": null,
    "scholarshipType": "등록금성 장학금",
    "ageLimit": 29,
    "regionalRestrictions": [
      "안산시"
    ],
    "incomeLevelRequirement": 1,
    "applicationPeriod": "2024-10-11 ~ 2024-10-11",
    "scholarshipAmount": "최대 100만원",
    "numberOfRecipients": null,
    "requiredDocuments": null,
    "applicationMethod": "온라인 접수",
    "significant": null,
    "link": "https://www.skku.edu/skku/campus/skk_comm/notice06.do?mode=view&articleNo=121357&article.offset=10&articleLimit=10",
    "views": 1740,
    "foundation": "안산인재육성재단"
  },
  {
    "_id": 15,
    "scholarshipName": "문행장학금",
    "eligibleMajors": null,
    "minimumGPARequirement": null,
    "eligibleSemesters": null,
    "scholarshipType": "등록금성 장학금",
    "ageLimit": null,
    "regionalRestrictions": null,
    "incomeLevelRequirement": 3,
    "applicationPeriod": "2024-10-15 ~ 2024-10-15",
    "scholarshipAmount": null,
    "numberOfRecipients": null,
    "requiredDocuments": null,
    "applicationMethod": "국가장학금 신청",
    "significant": null,
    "link": "https://www.skku.edu/skku/campus/skk_comm/notice06.do?mode=view&articleNo=121426&article.offset=10&articleLimit=10",
    "views": 4509,
    "foundation": null
  },
  {
    "_id": 16,
    "scholarshipName": "방일영 장학생",
    "eligibleMajors": null,
    "minimumGPARequirement": 3,
    "eligibleSemesters": [
      1
    ],
    "scholarshipType": "생활비 지원 장학금",
    "ageLimit": null,
    "regionalRestrictions": null,
    "incomeLevelRequirement": null,
    "applicationPeriod": "2024-10-16 ~ 2024-11-01",
    "scholarshipAmount": "70만원/월",
    "numberOfRecipients": null,
    "requiredDocuments": [
      "장학생 지원서",
      "학장 추천서",
      "성적증명서",
      "자기소개서",
      "수능성적표",
      "소득분위 관련 서류"
    ],
    "applicationMethod": "이메일 접수",
    "significant": null,
    "link": "https://www.skku.edu/skku/campus/skk_comm/notice06.do?mode=view&articleNo=121444&article.offset=10&articleLimit=10",
    "views": 813,
    "foundation": "방일영문화재단"
  },
  {
    "_id": 17,
    "scholarshipName": "덕신EPC 건축안전 장학금",
    "eligibleMajors": [
      "건축공학"
    ],
    "minimumGPARequirement": null,
    "eligibleSemesters": [
      7
    ],
    "scholarshipType": "생활비 지원 장학금",
    "ageLimit": null,
    "regionalRestrictions": null,
    "incomeLevelRequirement": null,
    "applicationPeriod": "2024-10-18 ~ 2024-10-31",
    "scholarshipAmount": "2000000원",
    "numberOfRecipients": 3,
    "requiredDocuments": [
      "추천서",
      "개인정보이용동의서",
      "장학생추천서추가정보",
      "주민등록등본",
      "성적증명서",
      "고화질 사진"
    ],
    "applicationMethod": "이메일 접수",
    "significant": "장학증서 수여식 필수 참석",
    "link": "https://www.skku.edu/skku/campus/skk_comm/notice06.do?mode=view&articleNo=121494&article.offset=10&articleLimit=10",
    "views": 1630,
    "foundation": "(주)덕신하우징"
  },
  {
    "_id": 18,
    "scholarshipName": "2024학년도 국가근로장학금",
    "eligibleMajors": null,
    "minimumGPARequirement": null,
    "eligibleSemesters": null,
    "scholarshipType": "근로장학금",
    "ageLimit": null,
    "regionalRestrictions": null,
    "incomeLevelRequirement": null,
    "applicationPeriod": "2024-10-21 ~ 2024-12-19",
    "scholarshipAmount": "12220원/시간",
    "numberOfRecipients": 255,
    "requiredDocuments": null,
    "applicationMethod": "한국장학재단 홈페이지",
    "significant": null,
    "link": "https://www.skku.edu/skku/campus/skk_comm/notice06.do?mode=view&articleNo=121534&article.offset=10&articleLimit=10",
    "views": 1521,
    "foundation": "한국장학재단"
  },
  {
    "_id": 19,
    "scholarshipName": "2024 녹색장학사업 장학생",
    "eligibleMajors": [
      "산림",
      "임업"
    ],
    "minimumGPARequirement": null,
    "eligibleSemesters": null,
    "scholarshipType": "학업장학금",
    "ageLimit": null,
    "regionalRestrictions": null,
    "incomeLevelRequirement": null,
    "applicationPeriod": "2024-10-22 ~ 2024-10-29",
    "scholarshipAmount": null,
    "numberOfRecipients": 130,
    "requiredDocuments": null,
    "applicationMethod": "이메일 접수",
    "significant": null,
    "link": "https://www.skku.edu/skku/campus/skk_comm/notice06.do?mode=view&articleNo=121560&article.offset=10&articleLimit=10",
    "views": 2317,
    "foundation": "한국산림복지진흥원"
  },
  {
    "_id": 20,
    "scholarshipName": "롯데장학관 입주생 모집",
    "eligibleMajors": null,
    "minimumGPARequirement": 3,
    "eligibleSemesters": null,
    "scholarshipType": "기숙사 장학금",
    "ageLimit": null,
    "regionalRestrictions": null,
    "incomeLevelRequirement": 8,
    "applicationPeriod": "2024-10-24 ~ 2024-11-25",
    "scholarshipAmount": null,
    "numberOfRecipients": null,
    "requiredDocuments": [
      "성적증명서",
      "소득분위 확인서",
      "입소지원서",
      "개인정보동의서"
    ],
    "applicationMethod": "이메일 접수",
    "significant": null,
    "link": "https://www.skku.edu/skku/campus/skk_comm/notice06.do?mode=view&articleNo=121618&article.offset=10&articleLimit=10",
    "views": 2336,
    "foundation": "롯데장학재단"
  },
  {
    "_id": 21,
    "scholarshipName": "울산연구원 장학생",
    "eligibleMajors": null,
    "minimumGPARequirement": null,
    "eligibleSemesters": null,
    "scholarshipType": "장학금",
    "ageLimit": null,
    "regionalRestrictions": null,
    "incomeLevelRequirement": null,
    "applicationPeriod": "2024-09-30 ~ 2024-10-23",
    "scholarshipAmount": null,
    "numberOfRecipients": null,
    "requiredDocuments": null,
    "applicationMethod": "메일 제출",
    "significant": null,
    "link": "https://www.skku.edu/skku/campus/skk_comm/notice06.do?mode=view&articleNo=121108&article.offset=20&articleLimit=10",
    "views": 2479,
    "foundation": "울산연구원"
  },
  {
    "_id": 22,
    "scholarshipName": "국가근로장학생 운영 현황",
    "eligibleMajors": null,
    "minimumGPARequirement": null,
    "eligibleSemesters": null,
    "scholarshipType": "근로장학금",
    "ageLimit": null,
    "regionalRestrictions": null,
    "incomeLevelRequirement": null,
    "applicationPeriod": "2024-10-02 ~ 2024-10-02",
    "scholarshipAmount": null,
    "numberOfRecipients": null,
    "requiredDocuments": null,
    "applicationMethod": "한국장학재단 홈페이지",
    "significant": null,
    "link": "https://www.skku.edu/skku/campus/skk_comm/notice06.do?mode=view&articleNo=121129&article.offset=20&articleLimit=10",
    "views": 2149,
    "foundation": null
  },
  {
    "_id": 23,
    "scholarshipName": "STX장학재단 신규 장학생",
    "eligibleMajors": null,
    "minimumGPARequirement": 3.5,
    "eligibleSemesters": [
      5
    ],
    "scholarshipType": "등록금성 장학금",
    "ageLimit": null,
    "regionalRestrictions": null,
    "incomeLevelRequirement": null,
    "applicationPeriod": "2024-11-01 ~ 2024-11-15",
    "scholarshipAmount": "300만원 + 월 50만원",
    "numberOfRecipients": 20,
    "requiredDocuments": [
      "주민등록등본",
      "성적증명서",
      "소득관련 증빙"
    ],
    "applicationMethod": "온라인 접수",
    "significant": null,
    "link": "https://www.skku.edu/skku/campus/skk_comm/notice06.do?mode=view&articleNo=121215&article.offset=20&articleLimit=10",
    "views": 4062,
    "foundation": "STX장학재단"
  },
  {
    "_id": 24,
    "scholarshipName": "아산사회복지재단 의생명과학분야 장학생",
    "eligibleMajors": [
      "의생명과학"
    ],
    "minimumGPARequirement": 3.7,
    "eligibleSemesters": [
      3,
      4
    ],
    "scholarshipType": "생활비 지원 장학금",
    "ageLimit": null,
    "regionalRestrictions": null,
    "incomeLevelRequirement": 5,
    "applicationPeriod": "2024-10-08 ~ 2024-10-27",
    "scholarshipAmount": "300만원",
    "numberOfRecipients": null,
    "requiredDocuments": [
      "학자금 지원구간 통지서",
      "가족관계증명서",
      "학교 추천서",
      "성적증명서"
    ],
    "applicationMethod": "온라인 신청",
    "significant": null,
    "link": "https://www.skku.edu/skku/campus/skk_comm/notice06.do?mode=view&articleNo=121236&article.offset=20&articleLimit=10",
    "views": 1357,
    "foundation": "아산사회복지재단"
  },
  {
    "_id": 25,
    "scholarshipName": "북한이탈청소년장학생",
    "eligibleMajors": null,
    "minimumGPARequirement": 3,
    "eligibleSemesters": [
      2,
      3,
      4
    ],
    "scholarshipType": "생활비 지원 장학금",
    "ageLimit": null,
    "regionalRestrictions": null,
    "incomeLevelRequirement": null,
    "applicationPeriod": "2024-10-08 ~ 2024-10-27",
    "scholarshipAmount": "300만원",
    "numberOfRecipients": null,
    "requiredDocuments": [
      "학자금 지원구간 통지서",
      "가족관계증명서",
      "성적증명서",
      "북한이탈주민확인서"
    ],
    "applicationMethod": "온라인 신청",
    "significant": null,
    "link": "https://www.skku.edu/skku/campus/skk_comm/notice06.do?mode=view&articleNo=121261&article.offset=20&articleLimit=10",
    "views": 741,
    "foundation": "아산사회복지재단"
  },
  {
    "_id": 26,
    "scholarshipName": "씨알장학금",
    "eligibleMajors": [
      "장애학생"
    ],
    "minimumGPARequirement": null,
    "eligibleSemesters": null,
    "scholarshipType": "생활비 지원 장학금",
    "ageLimit": null,
    "regionalRestrictions": null,
    "incomeLevelRequirement": null,
    "applicationPeriod": "2024-09-30 ~ 2024-10-25",
    "scholarshipAmount": "150만원",
    "numberOfRecipients": 2,
    "requiredDocuments": [
      "장학금지원신청서",
      "나의 꿈에 대한 에세이",
      "씨알장학금 활용 계획서"
    ],
    "applicationMethod": "이메일, 팩스, 우편",
    "significant": null,
    "link": "https://www.skku.edu/skku/campus/skk_comm/notice06.do?mode=view&articleNo=121005&article.offset=20&articleLimit=10",
    "views": 4727,
    "foundation": "서울장애인자립생활센터"
  },
  {
    "_id": 27,
    "scholarshipName": "하나장학생",
    "eligibleMajors": null,
    "minimumGPARequirement": 3,
    "eligibleSemesters": null,
    "scholarshipType": "생활비 지원 장학금",
    "ageLimit": null,
    "regionalRestrictions": null,
    "incomeLevelRequirement": 4,
    "applicationPeriod": "2024-09-30 ~ 2024-10-02",
    "scholarshipAmount": "100만원",
    "numberOfRecipients": 10,
    "requiredDocuments": [
      "하나장학생 신청서",
      "개인정보 수집∙이용 및 제공동의서",
      "성적증명서",
      "장학금 수혜 확인서",
      "주민등록등본",
      "가족관계증명서",
      "소득관련 증빙 서류"
    ],
    "applicationMethod": "이메일 접수",
    "significant": null,
    "link": "https://www.skku.edu/skku/campus/skk_comm/notice06.do?mode=view&articleNo=120844&article.offset=20&articleLimit=10",
    "views": 7911,
    "foundation": "하나금융나눔재단"
  },
  {
    "_id": 28,
    "scholarshipName": "귀뚜라미 장학생",
    "eligibleMajors": null,
    "minimumGPARequirement": null,
    "eligibleSemesters": null,
    "scholarshipType": "생활비 지원 장학금",
    "ageLimit": null,
    "regionalRestrictions": [
      "오산시"
    ],
    "incomeLevelRequirement": null,
    "applicationPeriod": "2024-10-21 ~ 2024-10-23",
    "scholarshipAmount": "500,000원 ~ 1,500,000원",
    "numberOfRecipients": 55,
    "requiredDocuments": [
      "장학생 지원 신청서",
      "재학증명서",
      "졸업증명서",
      "주민등록초본",
      "주민등록등본",
      "개인정보 수집·이용·제공 및 조회 동의서",
      "통장사본"
    ],
    "applicationMethod": "방문 제출",
    "significant": null,
    "link": "https://www.skku.edu/skku/campus/skk_comm/notice06.do?mode=view&articleNo=121275&article.offset=20&articleLimit=10",
    "views": 2873,
    "foundation": "오산교육재단"
  },
  {
    "_id": 29,
    "scholarshipName": "송화재단 장학생",
    "eligibleMajors": null,
    "minimumGPARequirement": 3.5,
    "eligibleSemesters": [
      5
    ],
    "scholarshipType": "등록금성 장학금",
    "ageLimit": null,
    "regionalRestrictions": null,
    "incomeLevelRequirement": null,
    "applicationPeriod": "2024-10-08 ~ 2024-10-15",
    "scholarshipAmount": null,
    "numberOfRecipients": null,
    "requiredDocuments": [
      "장학생 추천서",
      "장학생 신상기록부",
      "성적증명서",
      "주민등록등본"
    ],
    "applicationMethod": "이메일 접수",
    "significant": null,
    "link": "https://www.skku.edu/skku/campus/skk_comm/notice06.do?mode=view&articleNo=121214&article.offset=20&articleLimit=10",
    "views": 4656,
    "foundation": "송화재단"
}]

db.users.insertMany(usersData);
db.scholarships.insertMany(scholarshipsData);