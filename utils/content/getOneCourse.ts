export const getOneCourse = async (slug: string) => {
    const courseQuery = groq`*[_type == "course" && slug.current == "${slug}"][0]{
        "subcourses": *[_type == "subcourse" && references(^._id)]{
            title,
            description,
            orderRank,
            "contents": contents[]->{
                displayTitle,
                slug,
                contentType,
                orderRank
            } | order(orderRank asc)
        } | order(orderRank asc),
        "image": mainImage.asset->url,
        ...
    }`;
    const { data: courseData } = await useSanityQuery(courseQuery);
    return courseData;
}
