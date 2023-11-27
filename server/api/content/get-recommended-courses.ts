export default defineEventHandler(async (event) => {
    const sanity = useSanity();

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
    const courses= await sanity.fetch(query);
    return courses
})