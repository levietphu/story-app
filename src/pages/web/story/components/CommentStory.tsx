import { useState, useContext, useEffect, memo } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '~/context/AuthContextProvider'
import Moment from 'react-moment'
import 'moment/locale/vi'
import callApi from '~/ultis/callApi'

const CommentStory = memo(({ story, slug }: any) => {
  const [comment, setComment] = useState<any[]>([])
  const [commentChidren, setCommentChidren] = useState<any[]>([])
  const [checkComment, setCheckComment] = useState<boolean>(false)
  const [checkReply, setCheckReply] = useState<boolean>(false)
  const [answer, setAnswer] = useState<number>(0)
  const [content, setContent] = useState<string>('')
  const [replyContent, setReplyContent] = useState<string>('')
  const [totalComment, setTotalComment] = useState<number>(0)
  const [startOffset, setStartOffset] = useState<number>(0)

  const limit = 3

  const { user }: any = useContext(AuthContext)

  const callApiComment = async (offset = 0) => {
    await callApi('get', '', `get_comment?slug=${slug}&offset=${offset}`).then((res: any) => {
      if (comment.length > 0) {
        setComment(comment.concat(res.data.comments_story))
        setStartOffset(startOffset + limit)
      } else {
        setComment(res.data.comments_story)
      }
      setTotalComment(totalComment ? totalComment - limit : res.data.total_comment)
    })
  }

  const callApiCommentChidren = async () => {
    await callApi('get', '', `get_chidren_comment?slug=${slug}`).then((res: any) => {
      setCommentChidren(res.data.children_comments)
    })
  }

  const postComment = async (id_parent: number) => {
    await callApi(
      'post',
      {
        content: content,
        reply_content: replyContent,
        slug: slug,
        id_user: user.user.id,
        id_parent: id_parent
      },
      'post_comment'
    ).then((res: any) => {
      if (!id_parent) {
        setComment([res.data.comment, ...comment])
        setStartOffset(startOffset + 1)
      } else {
        setCommentChidren([...commentChidren, res.data.comment])
      }
    })
  }

  useEffect(() => {
    callApiComment()
    callApiCommentChidren()
  }, [])

  const handleComment = (word: string, id_parent: number) => {
    postComment(id_parent)
    if (word === 'comment') {
      setContent('')
    } else {
      setReplyContent('')
    }
  }

  const commentNameRole = (value: any) => {
    let name
    if (value.user.id === story.id_user) {
      name = 'Dịch giả'
    }
    value.user.roles.forEach((item: any) => {
      if (item.name === 'admin') {
        name = 'Admin'
      }
    })
    return name
  }

  return (
    <div className='story__comment'>
      <div className='head__story__comment'>
        <p>Bình luận</p>
      </div>
      <div className='comment__text'>
        {user ? (
          <>
            <textarea
              name=''
              className={checkComment ? 'comment__text--active' : ''}
              rows={5}
              placeholder='Hãy để lại bình luận của bạn'
              onClick={() => setCheckComment(!checkComment)}
              onBlur={() => setCheckComment(false)}
              onChange={(e) => setContent(e.target.value)}
              value={content}
            ></textarea>
            <div className='click__comment' onClick={() => user && content && handleComment('comment', 0)}>
              <button className={!content ? 'active__comment__button' : ''}>Bình luận</button>
            </div>
          </>
        ) : (
          <div className='login__here'>
            Hãy <Link to='/login'>Đăng nhập</Link> và để lại bình luận của bạn
          </div>
        )}
      </div>
      <div className='story__comment--list'>
        {comment.length > 0 ? (
          comment.map((value: any, index: any) => {
            return (
              <div key={index} className='story__comment--item'>
                <div className='comment--item'>
                  <p>
                    <span className='account__name'>{value.user.name}</span>{' '}
                    {value.user.id === story.id_user && <span className='role_name'>{commentNameRole(value)}</span>} •
                    <span className='time__update'>
                      {' '}
                      <Moment fromNow locale='vi'>
                        {value.created_at}
                      </Moment>
                    </span>
                  </p>
                  <p className='comment'>{value.content}</p>
                  <span className='show-input' onClick={() => user && setAnswer(value.id)}>
                    {commentChidren && commentChidren.filter((item: any) => item.id_parent === value.id).length} trả lời
                  </span>
                </div>
                {commentChidren.map((item: any, keygen: any) => {
                  if (item.id_parent === value.id) {
                    return (
                      <div className='recomment--item' key={keygen}>
                        <p>
                          <span className='account__name'>{item.user.name}</span>
                          {item.user.id === story.id_user && (
                            <span className='role_name'>{commentNameRole(item)}</span>
                          )}{' '}
                          •
                          <span className='time__update'>
                            {' '}
                            <Moment fromNow locale='vi'>
                              {item.created_at}
                            </Moment>
                          </span>
                        </p>
                        <p className='comment'>{item.content}</p>
                      </div>
                    )
                  }
                })}
                {answer === value.id && (
                  <div className='reply'>
                    <input
                      autoFocus
                      type='text'
                      className={checkReply ? 'comment__text--active' : ''}
                      onClick={() => setCheckReply(!checkReply)}
                      onBlur={() => setCheckReply(false)}
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                    />
                    <i
                      className='fa-solid fa-paper-plane'
                      style={{ opacity: '1' }}
                      onClick={() => replyContent && handleComment('reply', value.id)}
                    ></i>
                  </div>
                )}
              </div>
            )
          })
        ) : (
          <div className='spank_story'>
            <i>Truyện chưa có bình luận nào, hãy là người đầu tiên!</i>
          </div>
        )}
        {totalComment > 0 && (
          <div className='center'>
            <span className='view-more-comment' onClick={() => callApiComment(startOffset + limit)}>
              Xem thêm {totalComment} bình luận
            </span>
          </div>
        )}
      </div>
    </div>
  )
})

export default CommentStory
