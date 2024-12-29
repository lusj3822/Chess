import './playerbar.css';

interface Props {
    className: string;
    image: string;
    userName: string;
    turnStatus: string;
}

export default function Playerbar({className, image, userName, turnStatus}: Props) {

    return (
        <div className={`${className}`}>
            <div className='user-info'>
                <img src={`${image}`}></img>
                <h2>{`${userName}`}</h2>
                <h3 className={turnStatus === "Your turn" ? "active" : "inactive"}>{`${turnStatus}`}</h3>
            </div>
        </div>
    )
}