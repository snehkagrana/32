const { useState, useMemo, useEffect } = require('react')

export function useMediaQuery(query) {
    const mediaQuery = useMemo(() => window.matchMedia(query), [query])
    const [match, setMatch] = useState(mediaQuery.matches)

    useEffect(() => {
        const onChange = () => setMatch(mediaQuery.matches)
        mediaQuery.addEventListener('change', onChange)

        return () => mediaQuery.removeEventListener('change', onChange)
    }, [mediaQuery])

    return match
}
