import React from 'react'
import moment from 'moment'
import {connect} from 'react-redux'

import {GithubIcon} from 'components/Icons/GithubIcon'

import css from './Header.scss'


class Header extends React.Component {
  render() {
    const {printDate, title, author, editor} = this.props
    const date = moment(printDate)

    return (
      <div className={css.headerContainer}>
        <div>
          <div className={css.title}>
            <span className={css.dayName}>
              {date.format('dddd')}{' '}
            </span>
            {date.format('LL')}
          </div>
          <div className={css.subtitle}>
            {title && (
              <span className={css.titleItem}>
                "{title}" ▪
              </span>
            )}
            <span className={css.titleItem}>
              By {author}
            </span>
            {editor && (
              <span>
                {' ▪ '}Edited by {editor}
              </span>
            )}
          </div>
        </div>
        <a href="https://github.com/gzzo/crosswords" target="_blank">
          <GithubIcon/>
        </a>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const {puzzleMeta} = state.puzzle[ownProps.puzzleName] || {}
  return {
    ...puzzleMeta
  }
}

const connectedHeader = connect(mapStateToProps)(Header)

export {
  connectedHeader as Header,
}
