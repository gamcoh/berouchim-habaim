<script>
  import { Input, Listgroup, Avatar, Button } from 'flowbite-svelte';

  const ratings = [
    {id: 1, name: 'A', value: 'A', updated_at: "2023-04-01", pct: "90%"},
    {id: 2, name: 'B', value: 'B', updated_at: "2023-04-01", pct: "5%"},
    {id: 3, name: 'C', value: 'C', updated_at: "2023-04-01", pct: "5%"},
  ];

  const rating_colors = {
    'A': 'bg-green-500',
    'B': 'bg-yellow-500',
    'C': 'bg-red-500',
  }
</script>

<div class="addresses w-full">
  <Input type="text" defaultClass="element w-full font-mono" placeholder="Recherchez une adresse">
    <svg slot="right" aria-hidden="true" class="w-5 h-5 text-white dark:text-white mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path id="icon" fill-rule="evenodd" clip-rule="evenodd" d="M14.76 13.27L20.49 19L19 20.49L13.27 14.76C12.2 15.53 10.91 16 9.5 16C5.91 16 3 13.09 3 9.5C3 5.91 5.91 3 9.5 3C13.09 3 16 5.91 16 9.5C16 10.91 15.53 12.2 14.76 13.27ZM9.5 5C7.01 5 5 7.01 5 9.5C5 11.99 7.01 14 9.5 14C11.99 14 14 11.99 14 9.5C14 7.01 11.99 5 9.5 5Z"></path></svg>
  </Input>
  
  <div class="card element p-7 mt-5">
    <h2 class="text-xl">8 villa ghis Courbevoie - 92400</h2>
    <p class="text-xs mt-3 leading-5 font-mono">
      Voici les avis des internautes sur ce lieu. Notez que la mention 'A' signifie que le bâtiment est complètement Kasher, aucun obstacle sur votre chemin. 'B' signifie que le bâtiment est gérable, quoique difficile. 'C' indique un bâtiment impraticable (porte robotisée, etc.).
    </p>
    <p class="text-xs mt-3 leading-5 font-mono">
      Nous vous serions reconnaissants de partager votre opinion sur ce lieu, aidant ainsi d'autres membres de la communauté juive dans leurs recherches.
    </p>

    <Listgroup items={ratings} let:item class="mt-3 bg-transparent">
      <div class="flex items-center space-x-4">
        <Avatar class="flex-shrink-0 {rating_colors[item.value]} text-white">{item.name}</Avatar>
        <div class="flex-1 min-w-0">
          <p class="text-xxs text-white truncate">
            Mise à jour le {item.updated_at}
          </p>
        </div>
        <div class="inline-flex items-center text-base font-semibold text-white">
          {item.pct}
        </div>
      </div>
    </Listgroup>

    <div class="flex flex-col">
      <Button class="mt-5 self-end" outline color="white">Ajouter un avis</Button>
    </div>
  </div>
</div>
