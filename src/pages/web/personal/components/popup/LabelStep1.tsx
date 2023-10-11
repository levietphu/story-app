const LabelStep1 = ({ image }: any) => {
  return (
    <div className='label-step1'>
      <img src={import.meta.env.REACT_APP_UPLOADS + 'BankInfo/' + image} alt='webtruyen' />
    </div>
  )
}

export default LabelStep1
