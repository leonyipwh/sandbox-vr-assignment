import { getTimeGapHHmm } from "../../utils/time.ts";
import type { RecordResult } from '@shared/wordle.interface';

import './leaderboard.scss';

function Leaderboard({ data} : {data: RecordResult[]}) {
  return (
    <div className='leaderboard'>
      <div className='title'>Leaderboard</div>
      <div className="ranking">
        <div className='icons'>
          <div className='icons__item'>🏆</div>
          <div className='icons__item'>🥈</div>
          <div className='icons__item'>🥉</div>
        </div>
        <div className='result'>
          {data.map((record, index) => (
            <div className='result__item' key={index}>
              {getTimeGapHHmm(record.startTime, record.endTime)}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Leaderboard