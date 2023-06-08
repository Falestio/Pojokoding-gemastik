export const getOneCourse = async (slug: string) => {
    const courseQuery = groq`*[_type == "course" && slug.current == "${slug}"][0]{
        "content": *[_type == "content" && course._ref == ^._id]{title, slug, orderRank} | order(orderRank asc),
        "image": mainImage.asset->url,
        ...,
    }`;
    const { data: courseData } = await useSanityQuery(courseQuery);
    return courseData
}

