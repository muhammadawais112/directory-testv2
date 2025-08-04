function WorkingHour(props) {
  const { business } = props;
 
  const formatTo12Hour = time24 => {
        const [hour, minute] = time24.split(':')
        const date = new Date()
        date.setHours(+hour)
        date.setMinutes(+minute)
        return date.toLocaleTimeString([], {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        })
      }
  return (
    business?.business_hours?.filter((hour) => hour?.start_time || hour?.end_time)?.length > 0 &&

    <div className="bg-white p-6 rounded-lg shadow pr-4 w-full">
      <h1 className="text-xl font-bold mb-4 text-start">Hours</h1>
      <div className="relative overflow-x-auto ">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 light:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase light:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3 bg-gray-50 light:bg-gray-800">
                Day
              </th>
              <th scope="col" className="px-6 py-3">
                Start Time
              </th>
              <th scope="col" className="px-6 py-3 bg-gray-50 light:bg-gray-800">
                End Time
              </th>
            </tr>
          </thead>
          <tbody>
            {(business?.business_hours || [])
              .filter((hour) => hour?.start_time || hour?.end_time)
              .map((hour, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-200 light:border-gray-700"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 light:text-white light:bg-gray-800"
                  >
                    {hour?.day}
                  </th>
                  <td className="px-6 py-4">{formatTo12Hour(hour?.start_time) || "-"}</td>
                  <td className="px-6 py-4 bg-gray-50 light:bg-gray-800">
                    {formatTo12Hour(hour?.end_time) || "-"}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {/* </section> */}
    </div>
  );
}

export default WorkingHour;
