export default function getStackInterval(base, mod) {
    const max = base + mod;
    const min = base - mod;
    const random = Math.floor(Math.random() * (max - min + 1) + min);
    return random;
}