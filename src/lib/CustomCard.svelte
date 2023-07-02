<script>
  import { Listgroup, Avatar, Button } from 'flowbite-svelte';

  export let address;
  export let ratings;
  const rating_colors = {
    'A': 'bg-green-500',
    'B': 'bg-yellow-500',
    'C': 'bg-red-500',
  }
</script>

<div class="card element p-7 mt-5">
  <h2 class="text-xl">{address}</h2>
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
