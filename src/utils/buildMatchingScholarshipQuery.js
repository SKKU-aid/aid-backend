function buildMatchingScholarshipQuery(user, userAge) {
    return {
        $and: [
            //eligibleMajors
            {
                $or: [
                    { eligibleMajors: { $eq: null } },
                    { eligibleMajors: { $in: user.major } },
                ]
            },

            // minimumGPARequirement
            {
                $or: [
                    { minimumGPARequirement: { $eq: null } },
                    {
                        $expr: {
                            $cond: {
                                if: { $eq: ["$compTotalGPA", true] },
                                then: { $lte: ["$minimumGPARequirement", user.totalGPA] },
                                else: { $lte: ["$minimumGPARequirement", user.lastGPA] }
                            }
                        }
                    }
                ]
            },

            //elligibleSemesters
            {
                $or: [
                    { eligibleSemesters: { $eq: null } },
                    { eligibleSemesters: { $in: user.currentSemester } }
                ]
            },

            //ageLimit
            {
                $or: [
                    { ageLimit: { $eq: null } },
                    { ageLimit: { $gte: userAge } }
                ]
            },

            // regionalRestrictions
            {
                $or: [
                    { regionalRestrictions: { $eq: null } },
                    { regionalRestrictions: { $in: user.region } }
                ]
            },

            // incomeLevelRequirement
            {
                $or: [
                    { incomeLevelRequirement: { $eq: null } },
                    { incomeLevelRequirement: { $gte: user.incomeLevel } }
                ]
            },
        ]
    }
}