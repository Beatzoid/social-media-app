import Info from "../../components/profile/Info";
import Posts from "../../components/profile/Posts";
import { useAppSelector } from "../../redux/types/global";
import { IProfile } from "../../redux/types/profile";
import LoadIcon from "../../images/loading.gif";

const Profile = () => {
    const { profile }: { profile: IProfile } = useAppSelector((state) => state);

    return (
        <div className="profile">
            {profile.loading ? <img src={LoadIcon} alt="Loading" /> : <Info />}
            <Posts />
        </div>
    );
};

export default Profile;
