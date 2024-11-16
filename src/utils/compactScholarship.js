

function compactScholarship(scholarship, savedScholarshipIDs = []) {
    const scholarshipID = scholarship._id;
    return {
        scholarshipID,
        scholarshipName: scholarship.scholarshipName || "Unknown Scholarship",
        applicationPeriod: scholarship.applicationPeriod || "Unknown Period",
        foundation: scholarship.foundation || "Unknown Foundation",
        views: scholarship.views || 0,
        isFav: savedScholarshipIDs.includes(scholarshipID),
        tags: scholarship.tags || [
            scholarship.scholarshipType || "General",
            scholarship.regionalRestrictions?.[0] || "지역무관",
            scholarship.eligibleMajors?.[0] || "전공무관"
        ]
    };
}

module.exports = compactScholarship;