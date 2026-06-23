const SIMPSON_CHARACTERS = [
  "Homer Simpson",
  "Bart Simpson",
  "Marge Simpson",
  "Mr. Burns",
  "Lisa Simpson",
  "Apu Nahasapeemapetilon",
  "Sideshow Bob",
  "Milhouse Van Houten",
  "Ned Flanders",
]

export default function SimpsonsCharacters() {

  return (
    <ul>
      {
        SIMPSON_CHARACTERS.map(
          (name, index) => {
            return <li key={index}>{name}</li>
          }
        )
      }
    </ul>
  )  
}
