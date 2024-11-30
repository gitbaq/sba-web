async function Page({ params }: { params: Promise<{ subjectId: string }> }) {
  const subjectId = (await params)?.subjectId;
  return (
    <div
      className='flex flex-col h-lvh min-h-lvh w-full min-w-full items-center justify-center 
    font-russo
    bg-[url("/wordcloud.png")]'
    >
      <div className='flex flex-row bg-opacity-95 bg-gray-100 h-full w-full items-center justify-center'>
        <div
          className='flex flex-col md:max-w-lg max-w-sm
    font-russo lead_text'
        >
          <p className='heading text-nowrap'>
            Learning {subjectId.replace("%20", " ")}
          </p>
          {/* <p className='heading'>Learning</p> */}
          &quot;The expert in anything was once a beginner.&quot; <br />
          <br />
          <div className='w-full text-right icons_diff text-pink-800'>
            Helen Hayes
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
