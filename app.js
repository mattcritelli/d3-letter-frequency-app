const width = 800;
const height = 400;
const svg = d3.select('svg')
                .attr('width', width)
                .attr('height', height);

d3.select('#reset')
  .on('click', function() {
    d3.selectAll('.letter').remove();
    d3.select('#phrase').text('');
    d3.select('#count').text('');
})

d3.select('form').on('submit', function() {
  d3.event.preventDefault()

  const input = d3.select('input')
  const userPhrase = Array.from(input.property('value'))
  const data = createCharCount(userPhrase.slice())
  const barPadding = 10;
  const maxCharNum = data.slice().sort((a,b) => b.count - a.count)[0].count
  const numBars = data.length;
  const barWidth = (width / numBars) - barPadding;

  /**
   * DATA JOIN
   * Create update selection and store as variable
   * Join new data items with DOM elements & create enter/exit selections. Add
   * key function as second arg to data to match based on specific data instead
   * of index which is the default.
   */
  let letterChart = svg
    .selectAll('.letter')
    .data(data, function(d) { return d.character });

  /**
   * Access the elements contained in the enter selection. For each element
   * append a new div with appropriate classes.
   */
  let letterEnter = letterChart
    .enter()
    .append('g')
      .classed("letter", true)
      .classed("new", true);

  letterEnter.append('rect')
  letterEnter.append('text')

  letterEnter.merge(letterChart)
    .select('rect')
      .attr('width', function(d) { return barWidth })
      .attr('height', d => d.count * 50)
      .attr('x', function(d,i) { return (barWidth + barPadding) * i })
      .attr('y', function(d) { return height - (d.count * 50) })

  letterEnter.merge(letterChart)
    .select("text")
    .text(d => d.character)
      .attr('x', function(d,i) { return (barWidth + barPadding) * i + barWidth / 2})
      .attr('y', function(d) { return height - d.count * 50 - 10 })
      .attr('text-anchor', 'middle')

  /**
   * Remove new class from all existing DOM elements and remove all data
   * items in the exit selection.
   */
  letterChart
      .classed('new', false)
    .exit()
    .remove();

  d3.select('#phrase').text(`Analysis of: ${userPhrase.join('')}`)
  d3.select('#count').text(`New characters: ${letterChart.enter().nodes().length}`)
  input.property('value', '')
})

// Helper functions
 const createCharCount = wordArray => {
   let data = []

   for(let char of wordArray.sort()){
     let last = data[data.length-1]
     last && last.character === char ?
       last.count += 1 :
       data.push({character: char, count: 1})
   }
   return data
 }
