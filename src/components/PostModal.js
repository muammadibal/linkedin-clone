import { useState } from "react";
import styled from "styled-components";
import ReactPlayer from 'react-player'
import { connect } from "react-redux";
import firebase from 'firebase'
import {postArticleApi} from '../actions'

const PostModal = (props) => {
  const [editor, setEditor] = useState("");
  const [shareImage, setShareImage] = useState("");
  const [videoLink, setVideoLink] = useState('')
  const [asset, setAsset] = useState("")

  const handleChange = (e) => {
      const image = e.target.files[0]

      if(image === '' || image === undefined) {
          alert =(`not an image, the file is a ${typeof image}`)
      }

      setShareImage(image)
  }

  const switchAsset = (asset) => {
      setShareImage("")
      setVideoLink("")
      setAsset(asset)
  }

  const postArticle = (e) => {
      e.preventDefault()
      if(e.target !== e.currentTarget) {
          return;
      }

      const payload = {
          image: shareImage,
          video: videoLink,
          user: props.user,
          description: editor,
          timestamp: firebase.firestore.Timestamp.now()
      }

      props.postArticle(payload)
      reset(e)
  }

  const reset = (e) => {
    //   console.log(props.handleClick);
      setEditor("")
      setShareImage("");
      setVideoLink("");
      setAsset("");
      props.handleClick()
  }

  return (
    <Container>
      <Content>
        <Header>
          <h2>Create a post</h2>
          <button onClick={(e) => reset(e)}>
            <img src="/images/icon-close.svg" alt="" />
          </button>
        </Header>

        <SharedContent>
          <UserInfo>
            {props.user.photoURL ? (
              <img src={props.user.photoURL} alt="" />
            ) : (
              <img src="/images/user.svg" alt="" />
            )}
            <span>{props.user.displayName ? props.user.displayName : "Hi, There!" }</span>
          </UserInfo>

          <Editor>
            <textarea
              value={editor}
              onChange={(e) => setEditor(e.target.value)}
              placeholder="What do you want to talk about?"
              autoFocus={true}
            />
            {asset === "image" ? (
              <UploadImage>
                <input
                  type="file"
                  accept="image/gif, image/jpeg, image/png"
                  name="image"
                  id="file"
                  style={{ display: "none" }}
                  onChange={handleChange}
                />
                <p>
                  <label htmlFor="file" style={{ cursor: "pointer" }}>
                    Select an image to share
                  </label>
                </p>
                {shareImage && (
                  <img src={URL.createObjectURL(shareImage)} alt="" />
                )}
              </UploadImage>
            ) : (
              asset === "video" && (
                <>
                  <input
                    type="text"
                    placeholder="Please input video link"
                    value={videoLink}
                    onChange={(e) => setVideoLink(e.target.value)}
                  />
                  {videoLink && <ReactPlayer width={"100%"} url={videoLink} />}
                </>
              )
            )}
          </Editor>
        </SharedContent>

        <ShareCreation>
          <AttachAssets>
            <AssetButton onClick={() => switchAsset("image")}>
              <img src="/images/icon-photo.svg" alt="" />
            </AssetButton>
            <AssetButton onClick={() => switchAsset("video")}>
              <img src="/images/icon-video.svg" alt="" />
            </AssetButton>
          </AttachAssets>

          <ShareComment>
            <AssetButton>
              <img src="/images/icon-comment.svg" alt="" />
              Anyone
            </AssetButton>
          </ShareComment>

          <PostButton disabled={!editor ? true : false} onClick={e=> postArticle(e)}>Post</PostButton>
        </ShareCreation>
      </Content>
    </Container>
  );
};

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  color: black;
  background-color: rgba(0, 0, 0, 0.8);
  /* fadeIn comefrom styled component index.css */
  animation: fadeIn 0.3s;
`;

const Content = styled.div`
  width: 100%;
  max-width: 552px;
  background-color: white;
  max-height: 90%;
  overflow: initial;
  border-radius: 5px;
  position: relative;
  display: flex;
  flex-direction: column;
  top: 32px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
  font-size: 16px;
  line-height: 1.5;
  color: rgba(0, 0, 0, 0.6);
  font-weight: 400;
  justify-content: space-between;
  align-items: center;

  button {
    height: 40px;
    width: 40px;
    min-width: auto;
    color: rgba(0, 0, 0, 0.15);
    background: none;
    border: none;

    &:hover {
      background: rgba(0, 0, 0, 0.1);
      border-radius: 20px;
      cursor: pointer;
    }

    svg {
      pointer-events: none;
    }
  }
`;

const SharedContent = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow-y: auto;
  vertical-align: baseline;
  background: transparent;
  padding: 8px 12px;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  padding: 12px;

  svg,
  img {
    width: 48px;
    height: 48px;
    background-clip: content-box;
    border: 2px solid transparent;
    border-radius: 50%;
  }

  span {
    font-weight: 600;
    font-size: 16px;
    line-height: 1.5;
    margin-left: 5px;
  }
`;

const ShareCreation = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 24px 12px 16px;
`;

const AssetButton = styled.button`
  display: flex;
  align-items: center;
  height: 40px;
  min-width: auto;
  color: rgba(0, 0, 0, 0.5);
  background: none;
  border: none;
  &:hover {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 20px;
    cursor: pointer;
  }
`;

const AttachAssets = styled.div`
  display: flex;
  align-items: center;
  padding-right: 8px;

  /* select styled component asset button above */
  ${AssetButton} {
    width: 40px;
  }
`;

const ShareComment = styled.div`
  padding-left: 8px;
  margin-right: auto;
  border-left: 1px solid rgba(0, 0, 0, 0.15);

  ${AssetButton} {
    img,
    svg {
      margin-right: 5px;
      color: rgba(0, 0, 0, 0.15);
    }
  }
`;

const PostButton = styled.button`
  min-width: 60px;
  border-radius: 20px;
  padding: 0 16px;
  background: ${(props) => (props.disabled ? "rgba(0,0,0,0.1)" : "#0a66c2")};
  color: ${(props) => (props.disabled ? "rgba(0,0,0,0.7)" : "white")};
  border: none;
  transition-duration: 167ms;

  &:hover {
    background: ${(props) => (props.disabled ? "rgba(0,0,0,0.1)" : "#004182")};
    cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  }
`;

const Editor = styled.div`
  padding: 12px;

  textarea {
    width: 100%;
    min-height: 100px;
    resize: none;
    border:none;
  }

  input {
      width: 100%;
      height: 35px;
      font-size: 16px;
  }
`;

const UploadImage = styled.div`
/* text-align: center; */
img {
    width: 100%;
}
`
const mapStateToProps = (state) => {
    return {
        user: state.userState.user
    }
}

const mapDispatchToProps = (dispatch) => ({
    postArticle: (payload) => dispatch(postArticleApi(payload))
})

export default connect(mapStateToProps, mapDispatchToProps)(PostModal);
