

function buildMatchingScholarships(user) {
    return function (scholarship) {
        // eligibleMajors
        if (
            scholarship.eligibleMajors !== null &&
            !scholarship.eligibleMajors.includes(user.major)
        ) {
            return false;
        }

        // minimumGPARequirement
        if (scholarship.minimumGPARequirement !== null) {
            const gpaToCompare = scholarship.compTotalGPA ? user.totalGPA : user.lastGPA;
            if (scholarship.minimumGPARequirement > gpaToCompare) {
                return false;
            }
        }

        // eligibleSemesters
        if (
            scholarship.eligibleSemesters !== null &&
            !scholarship.eligibleSemesters.includes(user.currentSemester)
        ) {
            return false;
        }
        const today = new Date();
        const userBirthDay = user.birthday;
        const userAge = today.getFullYear() - userBirthDay.getFullYear();
        // ageLimit
        if (scholarship.ageLimit !== null && userAge > scholarship.ageLimit) {
            return false;
        }

        // regionalRestrictions
        if (
            scholarship.regionalRestrictions !== null &&
            !scholarship.regionalRestrictions.includes(user.region)
        ) {
            return false;
        }

        // incomeLevelRequirement
        if (
            scholarship.incomeLevelRequirement !== null &&
            user.incomeLevel > scholarship.incomeLevelRequirement
        ) {
            return false;
        }

        if (!scholarship.applicationPeriod) return false; // Exclude if no applicationPeriod
        const [start, end] = scholarship.applicationPeriod.split('~').map(date => new Date(date.trim()));
        return today >= start && today <= end; // Check if today is within the range
    };
}

module.exports = buildMatchingScholarships