<script setup>

const ucapanSelamat = useState("ucapanSelamat", () => true)
</script>

<template>
    <div 
    :class="{'h-screen overflow-hidden': ucapanSelamat}"
    >
    <div class="flex px-28 py-8 gap-12">
      <div class="w-1/2 text-justify">
        <h2 class="text-2xl font-bold mb-4">Testing Fitur Latihan Python One Compiler</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas lobortis lorem id placerat imperdiet. Quisque vitae nibh nibh. Maecenas vitae sem bibendum, pulvinar dolor eget, gravida lacus. Fusce condimentum lorem ut rutrum rhoncus. Aliquam ullamcorper tortor at purus pharetra, sed iaculis ex tempus. Phasellus scelerisque elit eget convallis bibendum. Nunc vulputate finibus urna, sollicitudin convallis urna molestie at. Aenean vestibulum ante eget leo consequat hendrerit id eget nisl. Donec vel nisl pretium, rhoncus justo iaculis, auctor ipsum. Morbi in sodales eros. Quisque ac magna massa. Nulla ante augue, pellentesque id consectetur vitae, tincidunt accumsan tortor. Fusce sagittis ac urna at faucibus. Praesent bibendum nibh diam, non euismod mauris efficitur tincidunt. Nulla quis mattis arcu.</p>
        <p>Maecenas venenatis, nulla sit amet tristique interdum, diam enim egestas nisl, et ullamcorper enim sem et lorem. Nulla ac porta nisl, a placerat erat. Suspendisse eget condimentum lectus. Vivamus ullamcorper arcu ac magna maximus, vel iaculis libero faucibus. Etiam nec scelerisque diam. Nam interdum dui quis turpis elementum elementum. Quisque faucibus erat tortor, sit amet pretium tellus egestas non. Phasellus hendrerit condimentum tortor eu congue. Quisque vehicula sapien sit amet eros lacinia, consequat lacinia arcu luctus. Vestibulum faucibus tortor eget sem sollicitudin, in finibus libero tristique. Cras tempus odio orci, quis tincidunt neque molestie ac. Cras aliquet suscipit eros et condimentum. Proin euismod dui in luctus sollicitudin. Proin at lorem malesuada, posuere sem non, fringilla augue. Quisque consectetur lectus sed elementum ultricies. Ut eu fringilla lacus.</p>
        <p>Integer gravida mollis quam, in blandit mi convallis quis. Proin in varius enim, dictum pretium felis. Nam dapibus luctus vestibulum. Maecenas iaculis sollicitudin risus, id rhoncus massa sagittis eu. Praesent condimentum porta odio, a mattis massa egestas vitae. Nulla at lorem lorem. Integer hendrerit risus lorem, vel dapibus massa sollicitudin in. Mauris ut eros ex. Praesent neque erat, fermentum vel ex eu, vestibulum tincidunt nunc. Vivamus quis justo sit amet odio sodales lobortis. Quisque pellentesque turpis purus, in elementum risus laoreet at. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      </div>
      <div class="h-screen w-1/2 bg-slate-800 px-3 py-1">
        <p>1 def isDewasa(umur):</p>
      </div>
    </div>
        <!-- TODO: Tampilkan subcourses pada sidebar -->
        <!-- TODO: Jumlah artikel dan latihan dijadikan dynamic -->
        <!-- TODO: REFACTOR -->
        <!-- <TheNavbar></TheNavbar> -->
        <!-- <Article v-if="contentStore.contentData.contentType == 'post'"></Article> -->
        <!-- <Exercise v-if="contentStore.contentData.contentType == 'exercise'"></Exercise> -->
        <!-- <p>Updated Sidebar</p>
        <pre>
            {{ contentStore.sidebarContent }}
        </pre>
        <p>Content Data</p>
        <pre>
            {{ contentStore.contentData }}
        </pre> -->
        <!-- <div class="h-screen absolute top-0 left-0 bg-neutral/60 w-screen flex justify-center pt-[18%]" v-if="ucapanSelamat">

            <div class="bg-base-100 px-4 py-2 rounded-md border border-secondary h-fit">
                <h3 class="text-3xl mb-2">😮👌</h3>
                <p>Selamat! Anda telah menyelesaikan modul [nama_modul]</p>
                <p>kerenn, ayoo lanjutkan belajar</p>
                <div class="flex justify-end">
                    <button class="px-4 py-1 rounded-md border border-secondary" @click="ucapanSelamat=false">Oke</button>
                </div>
            </div>
        </div> -->

      
    </div>
</template>

<style>
pre {
    white-space: pre-wrap; /* Since CSS 2.1 */
    white-space: -moz-pre-wrap; /* Mozilla, since 1999 */
    white-space: -pre-wrap; /* Opera 4-6 */
    white-space: -o-pre-wrap; /* Opera 7 */
    word-wrap: break-word; /* Internet Explorer 5.5+ */
}


</style>