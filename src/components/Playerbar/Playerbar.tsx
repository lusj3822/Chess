import './playerbar.css';

interface Props {
    className: string;
    image: string;
    userName: string;
}

export default function Playerbar({className, image, userName}: Props) {
    return (
        <div className={`${className}`}>
            <div className='user-info'>
                <img src={`${image}`}></img>
                <h2>{`${userName}`}</h2>
            </div>
        </div>
    )
}