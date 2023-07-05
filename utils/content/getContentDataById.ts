export const getContentDataById = async (contentId: string) => {
    const query = groq`
    *[
        _type == "content" &&
        _id =="${contentId}"
    ][0]`;

    const { data: contentData } = await useSanityQuery(query);
    const content = contentData.value;
    return content;
}