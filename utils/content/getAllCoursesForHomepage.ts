// in homepage fetch 6 courses only, then see all courses
export const getAllCoursesForHomepage = async () => {
    const query = groq`*[_type == "course"][0..5]{
        _id,
        _rev,
        "mainImage": mainImage.asset->url,
        title,
        slug,
        difficulty,
        shortDescription,
        postCount,
        exerciseCount,
        price,
        orderRank
    }`;
    const { data: courses } = await useSanityQuery(query);
    return courses
};
