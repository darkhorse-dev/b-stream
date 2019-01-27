import styled from '../styled'

const sizes = {
    phone: 768,
    tablet: 992,
    desktop: 1200,
}

const mediaQueries = {
    tiny: `@media (max-width: ${sizes.phone}px)`,
    phone: `@media (min-width: ${sizes.phone}px)`,
    tablet: `@media (min-width: ${sizes.tablet}px)`,
    desktop: `@media (min-width: ${sizes.desktop}px)`,
}

const Container = styled.div({
    label: 'container',
    paddingRight: '15px',
    paddingLeft: '15px',
    marginRight: 'auto',
    marginLeft: 'auto',
    [mediaQueries.phone]: {
        maxWidth: '750px',
    },
    [mediaQueries.tablet]: {
        maxWidth: '970px',
    },
    [mediaQueries.desktop]: {
        maxWidth: '1170px',
    },
})

const Row = styled.div({
    label: 'row',
    marginRight: '-15px',
    marginLeft: '-15px',
    [mediaQueries.phone]: {
        display: 'flex',
        justifyContent: 'center',
    },
})

const Column = styled.div({
    label: 'column',
    position: 'relative',
    minHeight: '1px',
    paddingRight: '15px',
    paddingLeft: '15px',
    [mediaQueries.phone]: {
        flex: `${(props: any) => props.width}`,
    },
})

export { mediaQueries, Container, Row, Column }
