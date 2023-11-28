export const getContentData = async (contentSlug: string, courseSlug: string) => {
    const query = groq`
    *[
        _type == "content" &&
        slug.current =="${contentSlug}" &&
        course._ref in
            *[_type == "course" && slug.current == "${courseSlug}"]._id
    ][0]{
        ...,
        "sidebar": *[_type == "content" && course._ref == ^.course._ref]{
            _id,
            title,
            slug,
            displayTitle,
            orderRank,
        }|order(orderRank asc),
        "languageConfig": languageConfig->{...}
    }`;
    const { data: contentData } = await useSanityQuery(query);
    const content = contentData.value;
    //@ts-ignore
    return content;
};
