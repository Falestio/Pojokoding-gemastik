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
            slug
        }
    }`;
    const { data: contentData } = await useSanityQuery(query);
    const content = contentData.value;
    return content;
};
