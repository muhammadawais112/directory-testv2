function WorkingHour(props) {
  const { business } = props;
  return (
    <section className="py-10">
      <div className="mx-auto max-w-screen-sm text-center mb-8 lg:mb-16">
        <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 light:text-white">
          Hours
        </h2>
        {/* <p class="font-light
                text-gray-500 lg:mb-16 sm:text-xl light:text-gray-400">Explore the whole collection of open-source web components and elements built with the utility classes from Tailwind</p> */}
      </div>
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
            {business.business_hours
              .filter((hour) => hour?.start_time || hour?.end_time) // Only include rows with at least one value
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
                  <td className="px-6 py-4">{hour?.start_time || "-"}</td>
                  <td className="px-6 py-4 bg-gray-50 light:bg-gray-800">
                    {hour?.end_time || "-"}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default WorkingHour;
