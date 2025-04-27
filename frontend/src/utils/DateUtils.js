export function formattedDate(dateGiven){
    const date = new Date(dateGiven);
    const optionsDate = { year: 'numeric', month: 'long', day: 'numeric' };
    const optionsTime = { hour: 'numeric', minute: '2-digit' };
    return `${date.toLocaleDateString('en-US', optionsDate)} at ${date.toLocaleTimeString('en-US', optionsTime)}`;
}