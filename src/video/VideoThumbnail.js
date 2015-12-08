import React, { PropTypes } from 'react';

export default class VideoThumbnail extends React.Component {

    static propTypes = {
		imgSrc: PropTypes.string.isRequired,
		title: PropTypes.string.isRequired,
		videoId: PropTypes.string.isRequired,
		onSelect: PropTypes.func,
	};

    render() {
        const { imgSrc, title, videoId } = this.props;

        return (
            <a target="_new" href={'https://www.youtube.com/watch?v=' + videoId}>
                <img src={imgSrc}/>
                <p>{title}</p>
            </a>
        );
    }
}
