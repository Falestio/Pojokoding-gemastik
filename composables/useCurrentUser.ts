export const useCurrentUser = () => {
    return useState('user', () => null)
}