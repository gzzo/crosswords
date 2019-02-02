import React from 'react'
import _ from 'lodash'
import Select from 'react-select'
import moment from 'moment'
import DayPicker from 'react-day-picker'

import {Page} from 'components/Page/Page'

import 'react-day-picker/lib/style.css'
import puzzleFiles from 'puzzleFiles.json'
import css from './Home.scss'

const createOption = value => ({
  label: value,
  value,
})

export class Home extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      category: createOption(Object.keys(puzzleFiles)[0])
    }
  }

  handleChangeCategory = value => {
    this.setState({
      category: value
    })
  }

  handleChangePuzzle = value => {
    this.props.history.push(`/puzzle/${this.state.category.value}/${value.value}`)
  }

  handleSelectDay = value => {
    this.props.history.push(`/puzzle/${this.state.category.value}/${moment(value).format('YYYY_MM_DD')}`)
  }

  renderPicker = () => {
    const {category} = this.state
    const selectedPuzzles = puzzleFiles[category.value]

    if (category.value === 'daily' || category.value === 'mini') {
      const firstDate = moment(_.first(selectedPuzzles), 'YYYY_MM_DD')
      const lastDate = moment(_.last(selectedPuzzles), 'YYYY_MM_DD')
      const lastMonth = new Date(lastDate.year(), lastDate.month())

      return (
        <div className={css.dateContainer}>
          <DayPicker
            fromMonth={new Date(firstDate.year(), firstDate.month())}
            toMonth={lastMonth}
            month={lastMonth}
            onDayClick={this.handleSelectDay}
            disabledDays={{
              before: firstDate.toDate(),
              after: lastDate.toDate()
            }}
          />
        </div>
      )
    } else {
      return (
        <div className={css.selectContainer}>
          <Select options={selectedPuzzles.map(createOption)} onChange={this.handleChangePuzzle}/>
        </div>
      )
    }
  }

  render() {
    return (
      <Page className={css.container}>
        <div className={css.content}>
          <div className={css.selectContainer}>
            <Select
              options={Object.keys(puzzleFiles).map(createOption)}
              onChange={this.handleChangeCategory}
              value={this.state.category}
            />
          </div>
          {this.renderPicker()}
        </div>
      </Page>
    )
  }
}
