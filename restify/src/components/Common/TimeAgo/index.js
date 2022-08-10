import moment from "moment";

const TimeAgo = ({time, type}) =>{
    let year = time.slice(0, 4)
    let month = time.slice(5, 7)
    let day = time.slice(8, 10)

    // let ago = moment(time).add(4, "hour").fromNow()
    let ago = moment(time).fromNow()
    return <>
        {ago}
    </>
}
export default TimeAgo