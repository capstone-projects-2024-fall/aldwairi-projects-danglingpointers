export default function getStackInterval(base, mod) {
    const random = Math.floor(Math.random() * base + (base - mod));
    return random;
}