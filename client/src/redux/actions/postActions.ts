import { Dispatch } from "redux";

import { getDataAPI, patchDataAPI, postDataAPI } from "../../utils/fetchData";
import { imageUpload } from "../../utils/imageUpload";

import { IAlertType } from "../types/alert";
import { IAuth, IAuthType } from "../types/auth";
import { GLOBALTYPES } from "../types/global";
import { IPostType } from "../types/post";

export const createPost =
    ({
        content,
        images,
        auth
    }: {
        content: string;
        images: any[];
        auth: IAuth;
    }) =>
    async (dispatch: Dispatch<IAlertType | IAuthType | IPostType>) => {
        let media: any[] = [];
        try {
            dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });
            if (images.length > 0) media = await imageUpload(images, "post");

            const res = await postDataAPI(
                "posts",
                { content, images: media },
                auth.token
            );
            dispatch({
                type: GLOBALTYPES.CREATE_POST,
                payload: { ...res.data.newPost, user: auth.user }
            });

            dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: false } });
        } catch (err) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: { error: err.response.data.err }
            });
        }
    };

export const getPosts =
    (token: string) => async (dispatch: Dispatch<IAlertType | IPostType>) => {
        try {
            dispatch({ type: GLOBALTYPES.LOADING_POST, payload: true });
            const res = await getDataAPI("posts", token);
            dispatch({ type: GLOBALTYPES.GET_POSTS, payload: res.data });

            dispatch({ type: GLOBALTYPES.LOADING_POST, payload: false });
        } catch (err) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: { error: err.response.data.err }
            });
        }
    };

export const updatePost =
    ({
        content,
        images,
        auth,
        status
    }: {
        content: string;
        images: any[];
        auth: IAuth;
        status: any;
    }) =>
    async (dispatch: Dispatch<IAlertType | IAuthType | IPostType>) => {
        let media: any[] = [];
        const imageNewUrl = images.filter((img) => !img.url);
        const imageOldUrl = images.filter((img) => img.url);

        if (
            status.content === content &&
            imageNewUrl.length === 0 &&
            imageOldUrl.length === status.images.length
        )
            return;

        try {
            dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });
            if (imageNewUrl.length > 0)
                media = await imageUpload(images, "post");

            const res = await patchDataAPI(
                `post/${status._id}`,
                { content, images: [...imageOldUrl, ...media] },
                auth.token
            );

            dispatch({
                type: GLOBALTYPES.UPDATE_POST,
                payload: res.data.newPost
            });
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: { success: res.data.msg }
            });
        } catch (err) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: { error: err.response.data.err }
            });
        }
    };